const express = require("express");
const app = express();
const AWS = require("aws-sdk");
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

const ACCESS_KEY = process.env.AWS_ACCESS_KEY_01;
const SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY_01;
const HOSTEDZONE_ID = process.env.HOSTED_ZONE_ID_01;

app.use(
  cors({
    origin: "https://aws-dns-dashboard.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.use(express.json());

AWS.config.update({
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_ACCESS_KEY,
});

const route53 = new AWS.Route53();

app.get("/api/records", async (req, res) => {
  try {
    const recordData = {
      HostedZoneId: HOSTEDZONE_ID,
    };

    const recordsData = await route53
      .listResourceRecordSets(recordData)
      .promise();

    const domains = recordsData.ResourceRecordSets.map((record) => ({
      name: record.Name,
      type: record.Type,
      value: record.ResourceRecords.map((resource) => resource.Value).join(
        ", "
      ),
      TTL: record.TTL,
    }));

    res.json(domains);
  } catch (error) {
    console.error("Error fetching domains:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/create", async (req, res) => {
  try {
    const { name, type, value } = req.body;

    const params = {
      HostedZoneId: HOSTEDZONE_ID,
      ChangeBatch: {
        Changes: [
          {
            Action: "CREATE",
            ResourceRecordSet: {
              Name: name,
              Type: type,
              TTL: 300,
              ResourceRecords: [{ Value: value }],
            },
          },
        ],
      },
    };

    await route53.changeResourceRecordSets(params).promise();

    res.json({ message: "DNS record created successfully" });
  } catch (error) {
    console.error("Error creating DNS record:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/update", async (req, res) => {
  try {
    const { newName, newType, newValue } = req.body;

    const selectedDomain = req.body.selectedDomain;

    const deleteParams = {
      HostedZoneId: HOSTEDZONE_ID,
      ChangeBatch: {
        Changes: [
          {
            Action: "DELETE",
            ResourceRecordSet: {
              Name: selectedDomain.name,
              Type: selectedDomain.type,
              TTL: selectedDomain.TTL,
              ResourceRecords: [{ Value: selectedDomain.value }],
            },
          },
        ],
      },
    };

    await route53.changeResourceRecordSets(deleteParams).promise();

    const createParams = {
      HostedZoneId: HOSTEDZONE_ID,
      ChangeBatch: {
        Changes: [
          {
            Action: "CREATE",
            ResourceRecordSet: {
              Name: newName,
              Type: newType,
              TTL: 300,
              ResourceRecords: [{ Value: newValue }],
            },
          },
        ],
      },
    };

    await route53.changeResourceRecordSets(createParams).promise();

    res.json({ message: "DNS record updated successfully" });
  } catch (error) {
    console.error("Error updating DNS record:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/delete", async (req, res) => {
  try {
    const selectedDomain = req.body.selectedDomain;

    const deleteParams = {
      HostedZoneId: HOSTEDZONE_ID,
      ChangeBatch: {
        Changes: [
          {
            Action: "DELETE",
            ResourceRecordSet: {
              Name: selectedDomain.name,
              Type: selectedDomain.type,
              TTL: selectedDomain.TTL,
              ResourceRecords: [{ Value: selectedDomain.value }],
            },
          },
        ],
      },
    };

    await route53.changeResourceRecordSets(deleteParams).promise();

    res.json({ message: "DNS record deleted successfully" });
  } catch (error) {
    console.error("Error deleting DNS record:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
