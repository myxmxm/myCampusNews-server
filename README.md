# NOKIA MY CAMPUS NEWS REST API

Backend servive for Nokia My Campus news project - Autumn 2022 - Metropolia

## BUILD

1. Clone the project

```
    git clone https://github.com/myxmxm/myCampusNews-server.git
```

2. Install dependencies

```
    npm i
```

3. Create/edit .env file with your database credentials.

```
 DB_HOST=127.0.0.1
 DB_USER=<your-db-user>
 DB_PASS=<your-db-user_password>
 DB_NAME=<your-db-name>
 JWT_SECRET=jwt_secret
```

4. Run the application

```
node app.js
```

## DATABASE STRUCTURE

![Database structure](assets/database.png?raw=true "Database") <br>

## API REFERENCE

### AUTHENTICATION

#### Register

```http
  POST /auth/register
```

```http
  'Content-Type': 'application/json'
```

| Parameter  | Type     | Description                                                        |
| :--------- | :------- | :----------------------------------------------------------------- |
| `name`     | `string` | **Required, min length 3**                                         |
| `email`    | `email`  | **Required, email**                                                |
| `password` | `string` | **Required, min length 8 characters, at least one capital letter** |

Response:

```json
{
  "message": "user added with id: 80",
  "status": 200
}
```

#### Login

```http
  POST /auth/login
```

```http
  Content-type: application/json
```

| Parameter  | Type     | Description  |
| :--------- | :------- | :----------- |
| `email`    | `email`  | **Required** |
| `password` | `string` | **Required** |

Response:

```json
{
  "user": {
    "user_id": 73,
    "email": "nathanda.malaika@nokia.com",
    "full_name": "Nthanda Malaika",
    "avatar_name": "399edabbaa6d3060e1fa4d8db958b28d",
    "contact_n": "346344356",
    "employee_n": "436535464",
    "department_l": "Helsinki",
    "role": 0
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo3MywiZW1haWwiOiJhQG5va2lhLmNvbSIsImZ1bGxfbmFtZSI6Ik50aGFuZGEgTWFsYWlrYSIsImF2YXRhcl9uYW1lIjoiMzk5ZWRhYmJhYTZkMzA2MGUxZmE0ZDhkYjk1OGIyOGQiLCJjb250YWN0X24iOiIzNDYzNDQzNTYiLCJlbXBsb3llZV9uIjoiNDM2NTM1NDY0IiwiZGVwYXJ0bWVudF9sIjoiSGVsc2lua2kiLCJyb2xlIjowLCJpYXQiOjE2NzA1NzE1NDN9.20lp-XJPC7Iwu7homMQLHzTGwVSFcXpvoVJVM-e4_iY"
}
```

### USER

#### Get all users

```http
  GET /user
```

```http
  Authorization: Bearer token
```

Response:

```json
[
    ......
  {
        "user_id": 1,
        "email": "rayhaan.peck@nokia.com",
        "full_name": "Rayhaan Peck",
        "avatar_name": "2ea3e4addb00f66193fb0f809adf571f",
        "contact_n": "",
        "employee_n": "",
        "department_l": "",
        "role": 0
    },
    {
        "user_id": 2,
        "email": "tiarna.maddox@nokia.com",
        "full_name": "Tiarna Maddox",
        "avatar_name": "d2991fd3af79294a54b6ebc6095a1aff",
        "contact_n": "",
        "employee_n": "",
        "department_l": "",
        "role": 1
    },
    .......
]
```

#### Get user by token

```http
  GET /user/token
```

```http
  Authorization: Bearer token
```

Response:

```json
[
  {
    "user": {
      "user_id": 73,
      "email": "nathanda.malaika@nokia.com",
      "full_name": "Nthanda Malaika",
      "avatar_name": "399edabbaa6d3060e1fa4d8db958b28d",
      "contact_n": "346344356",
      "employee_n": "436535464",
      "department_l": "Helsinki",
      "role": 0,
      "iat": 1670571688
    }
  }
]
```

#### Get user by Id

```http
  GET user/userid/:userId
```

```http
  Authorization: Bearer token
```

#### Modify user info

```http
  PUT /user/update
```

```http
  'Content-Type': 'multipart/form-data',
```

| Parameter            | Type     | Description                |
| :------------------- | :------- | :------------------------- |
| `fullName`           | `string` | **Required, min length 3** |
| `email`              | `email`  | **Required, email**        |
| `contactNumber`      | `string` | **Optional**               |
| `employeeNumber`     | `string` | **Optional**               |
| `departmentLocation` | `string` | **Optional**               |
| `avatar`             | `file`   | **Optional**               |

Response:

```json
[
  {
    {
    "message": "User info updated"
}
}
]
```

### News

#### Get all news

```http
  GET /news/draft/:draft
```

```http
  Authorization: Bearer token
```

Response:

```json
[
    .......
  {
        "news_id": 25,
        "news_title": "another  extra news from nischhal",
        "news_op": "",
        "news_content": "Some randon stuffs",
        "photoName": "1b805e4341c864206ead5c35e0a76569",
        "category": "announcement",
        "news_time": "2022-11-12T12:22:06.000Z",
        "is_draft": 0,
        "highlighted": 0
    },
    {
        "news_id": 28,
        "news_title": "Scientists say global warming beyong 1.5 degress likely",
        "news_op": "",
        "news_content": "The existing climate pledges made by the world are insufficient to keep the 2015 Paris Agreement's aim within reach. It is anticipated that global warming will exceed the 1.5 degree Celsius threshold. While exceeding the 1.5 degree limit appears inevitable, the researchers chart several potential courses in which the overshoot period is shortened, in some cases by decades.",
        "photoName": "6c9c6a0df945b985ff572c0d852b96ba",
        "category": "internal",
        "news_time": "2022-11-14T13:44:11.000Z",
        "is_draft": 0,
        "highlighted": 0
    },
    .........
]
```





## CONTRIBUTORS

[Xiaoming Ma](https://github.com/myxmxm)<br>
[Nischhal Shrestha](https://github.com/Nischhal3) <br>
[Boris Hoi](https://github.com/Borissss420)<br>
