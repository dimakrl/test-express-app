import {S3Client, GetObjectCommand, PutObjectCommand} from "@aws-sdk/client-s3";
import {DeleteMessageCommand, ReceiveMessageCommand, SendMessageCommand, SQSClient} from "@aws-sdk/client-sqs";
import {Repository} from "typeorm";
import {Image} from "./image.entity";
import dataSource from "../../ormconfig";
import {CONFIG} from "../../shared/app.config";
import {Response} from 'express';
import {SNSClient, PublishCommand} from "@aws-sdk/client-sns";
import {LambdaClient, InvokeCommand} from "@aws-sdk/client-lambda";

const cron = require('node-cron');

const awsConfig = {
    ...(CONFIG.DEVELOPMENT ? {
        credentials: {
            accessKeyId: CONFIG.AWS_USER_ACCESS_KEY,
            secretAccessKey: CONFIG.AWS_USER_SECRET_ACCESS_KEY,
        }
    } : {}),
    region: CONFIG.REGION,
} as any

const s3 = new S3Client(awsConfig);
const sqs = new SQSClient(awsConfig);
const sns = new SNSClient(awsConfig);
const lambda = new LambdaClient(awsConfig);

cron.schedule('*/1 * * * *', async () => {
    // running a task every 1 minute

    console.log('Initiate lambda');

    const lambdaRes = await lambda.send(new  InvokeCommand({
        FunctionName: 'images-api-upload-images-notifications'
    }));

    console.log(lambdaRes, 'lambdaRes');

    // triggered from lambda

    // const {Messages} = await sqs.send(new ReceiveMessageCommand({
    //     QueueUrl: 'https://sqs.eu-north-1.amazonaws.com/088421625276/images-api-queue',
    //     MaxNumberOfMessages: 1,
    // }))
    //
    // console.log(Messages, 'Messages');
    //
    // if (!Messages?.[0]) {
    //     return;
    // }
    //
    // console.log('Initiate notification sending');
    //
    // const notificationResponse = await sns.send(new PublishCommand({
    //     Message: Messages[0].Body,
    //     TopicArn: 'arn:aws:sns:eu-north-1:088421625276:images-api-notifications'
    // }));
    //
    // console.log(notificationResponse, 'notificationResponse')
    //
    // const deleteMessageResponse = await sqs.send(new DeleteMessageCommand({
    //     QueueUrl: 'https://sqs.eu-north-1.amazonaws.com/088421625276/images-api-queue',
    //     ReceiptHandle: Messages[0].ReceiptHandle,
    // }))
    //
    // console.log(deleteMessageResponse, 'deleteMessageResponse');
});

export class ImageService {
    private readonly bucketName = CONFIG.BUCKET_NAME;
    private readonly repository: Repository<Image>;

    constructor() {
        this.repository = dataSource.getRepository(Image);
    }

    async findOne(imageKey: string, res: Response) {
        const candidate = await this.repository.findOne({
            where: {s3ImageKey: imageKey},
        });

        if (!candidate) {
            res.status(404);
            res.json({
                error: 'Not Found'
            })

            return;
        }

        const imagesResponse = await s3.send(new GetObjectCommand({
            Bucket: this.bucketName,
            Key: candidate.s3ImageKey,
        }));

        const streamToBuffer = (stream) =>
            new Promise((resolve, reject) => {
                const chunks = [];
                stream.on("data", (chunk) => chunks.push(chunk));
                stream.on("error", reject);
                stream.on("end", () => resolve(Buffer.concat(chunks)));
            });

        const bodyContents = await streamToBuffer(imagesResponse.Body);

        res.contentType(imagesResponse.ContentType);
        res.write(bodyContents);
        res.end();
    }

    private async uploadFileToS3(file, name, mimetype) {
        const params = {
            Bucket: this.bucketName,
            Key: String(name),
            Body: file,
            ContentType: mimetype,
            ContentDisposition: 'inline',
        };

        try {
            return await s3.send(new PutObjectCommand(params));
        } catch (e) {
            console.log(e);
        }
    }

    async create(file: Express.Multer.File, createDto: any, res: Response) {
        if (!file) {
            res.status(404);
            res.json({
                error: 'Not Found'
            })
            return;
        }

        const duplicate = await this.repository.findOne({where: {s3ImageKey: createDto.name}});

        if (duplicate) {
            res.status(400);
            res.json({
                error: 'Such img uploaded'
            })
            return;
        }

        const uploadedFile = await this.uploadFileToS3(
            file.buffer,
            createDto.name,
            file.mimetype,
        );

        if (!uploadedFile) {
            res.status(400);
            res.json({
                error: 'Bad Request'
            })
            return;
        }

        const result = await this.repository.save({
            s3ImageKey: createDto.name,
            description: 'default',
            name: createDto.name,
        });

        const response = await sqs.send(new SendMessageCommand({
            QueueUrl: 'https://sqs.eu-north-1.amazonaws.com/088421625276/images-api-queue',
            MessageBody: JSON.stringify({
                name: createDto.name,
                url: `http://localhost:3000/images/${createDto.name}`
            })
        }))

        res.json({
            key: result.s3ImageKey
        })
    }
}

export default new ImageService();
