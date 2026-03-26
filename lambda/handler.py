import json
import uuid
import boto3

TABLE = "job-applications"
ddb = boto3.resource("dynamodb").Table(TABLE)

CORS = {
    "Access-Control-Allow-Origin": "https://d11prb57h52eru.cloudfront.net",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
}


def ok(body, code=200):
    return {"statusCode": code, "headers": CORS, "body": json.dumps(body)}


def err(msg, code=400):
    return {"statusCode": code, "headers": CORS, "body": json.dumps({"error": msg})}


def handler(event, context):
    method = event.get("httpMethod", "")
    resource = event.get("resource", "")
    route = f"{method} {resource}"
    params = event.get("pathParameters") or {}
    body = json.loads(event.get("body") or "{}")

    if route == "GET /jobs":
        items = ddb.scan().get("Items", [])
        return ok(items)

    if route == "POST /jobs":
        job = {**body, "applicationId": str(uuid.uuid4())}
        ddb.put_item(Item=job)
        return ok(job, 201)

    if route == "PUT /jobs/{id}":
        job_id = params["id"]
        existing = ddb.get_item(Key={"applicationId": job_id}).get("Item")
        if not existing:
            return err("Not found", 404)
        updated = {**existing, **body, "applicationId": job_id}
        ddb.put_item(Item=updated)
        return ok(updated)

    if route == "DELETE /jobs/{id}":
        ddb.delete_item(Key={"applicationId": params["id"]})
        return ok({"success": True})

    return err("Not found", 404)
