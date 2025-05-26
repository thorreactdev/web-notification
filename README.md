# 🔔 Push Notification System with RabbitMQ & Firebase Cloud Messaging

## 📋 Overview

This project is a full-stack push notification system that enables real-time notifications to subscribed users. It integrates:

- **Frontend**: React (Vite) for user interaction and notification display.
- **Backend**: Node.js with Express for handling API requests and managing Firebase Cloud Messaging.
- **Message Broker**: RabbitMQ for decoupled and scalable message handling.
- **Containerization**: Docker and Docker Compose for streamlined development and deployment.


## 🚀 Features

- **User Subscription**: Users can subscribe to notifications via the frontend.
- **Notification Publishing**: Backend API to publish notifications to all subscribers.
- **Real-time Delivery**: Utilizes RabbitMQ and FCM for instant notification delivery.
- **Dockerized Setup**: Easy setup with Docker Compose.

# 🛠️ Getting Started

## Prerequisites

- Docker
- Node.js (for local development without Docker)

## Installation

### Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```
### Set Up Environment Variables
- Create a .env file in the backend/ directory with the following content:
```bash
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672/
FIREBASE_CREDENTIALS=/app/serviceAccountKey.json
VAPID_KEY=your-vapid-key

Replace your-vapid-key with your actual Firebase VAPID key.
```
### Add Firebase Credentials
- Place your serviceAccountKey.json file in the backend/ directory.

### Build and Run with Docker Compose
```bash
cd backend
docker-compose up --build
```

### Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **RabbitMQ Management UI**: http://localhost:15672
- **Username**: guest
- **Password**: guest

### 📬 API Documentation
- Register Device Token
- Endpoint: POST /api/devices/register
- Description: Registers a device's FCM token.

- Request Body
```bash
{
  "fcm_token": "your-device-fcm-token"
}
```
- Response
```bash
{
  "message": "Token registered successfully"
}
```

### Publish Notification

- **Endpoint**: POST /api/notifications/publish
- **Description**: Publishes a notification to all registered devices.
- Request Body:

```bash
{
  "title": "Notification Title",
  "body": "Notification Body",
  "data": {
    "link": "https://example.com"
  },
  "image_url": "https://example.com/image.png",
  "action_url": "https://example.com/action"
}
```
- Response

```bash
{
  "message": "Notification published successfully"
}
```


