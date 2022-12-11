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
| `avatar`             | `file`   | **Required, image**        |

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

#### Get news by id

```http
  GET /news/:newsId
```

```http
  Authorization: Bearer token
```

Response:

```json
[
  {
    "news_id": 478,
    "news_title": "Nokia launches second phase of share buyback program and cancels repurchased shares",
    "news_op": "Nokia launches second phase of share buyback program and cancels repurchased shares",
    "news_content": "Espoo, Finland – In line with the announcement on 3 February 2022, the Board of Directors of Nokia Corporation (\"Nokia\" or the \"Company\") has today decided to launch the second EUR 300 million phase of the share buyback program that aims to return up to EUR 600 million of cash to its shareholders in tranches over a period of two years. Repurchases are expected to resume in early January. The first phase of the share buyback program with a maximum aggregate purchase price of EUR 300 million was initiated on 14 February 2022 and it was completed on 11 November 2022.",
    "photoName": "e350312588f66ec5599004ec3428e355",
    "category": "business",
    "news_time": "2022-12-09T08:46:01.000Z",
    "is_draft": 0,
    "highlighted": 1
  }
]
```

#### Delete news by id

```http
  DELETE /news/:newsId
```

```http
  Authorization: Bearer token
```

Response:

```json
[
  {
    "message": "News id 543 deleted"
  }
]
```

#### Get all news by category

```http
  GET /news/search/category/:category
```

```http
  Authorization: Bearer token
```

Response:

```json
[
  {
    "news_id": 486,
    "news_title": "Nokia responds to New York Times article of March 28 on lawful interception",
    "news_op": "28 March 2022",
    "news_content": "The New York Times, in its article of March 28, makes claims regarding Nokia’s role in Russia’s lawful intercept system, also known by the abbreviation SORM. Nokia believes this article is misleading. As Nokia has made clear to The New York Times, Nokia does not manufacture, install or service SORM equipment or systems. Any suggestions that we do, are incorrect.\n\n",
    "photoName": "df409dfdc7b614e0c5a5801ad91dfd36",
    "category": "internal",
    "news_time": "2022-12-09T09:33:40.000Z",
    "is_draft": 0,
    "highlighted": 1
  }
]
```

#### Post news

```http
  POST /news
```

```http
  Authorization: Bearer token
  Content-Type: multipart/form-data
```

| Parameter      | Type     | Description         |
| :------------- | :------- | :------------------ |
| `newsPhoto`    | `file`   | **Required, image** |
| `news_title`   | `string` | **Required**        |
| `news_op`      | `string` | **Required**        |
| `news_content` | `string` | **Required**        |
| `draft`        | `int`    | **Required**        |

Response:

```json
[
  {
    "message": "546",
    "status": 200
  }
]
```

#### Post extra paragraph to news

```http
  POST /news/paragraph/:newsId
```

```http
  Authorization: Bearer token
  Content-Type: multipart/form-data
```

| Parameter          | Type     | Description                  |
| :----------------- | :------- | :--------------------------- |
| `paragraphPhoto`   | `file`   | **Optional, image or video** |
| `photoDescription` | `string` | **Optional**                 |
| `content`          | `string` | **Optional**                 |
| `type`             | `string` | **Optional**                 |

Response:

```json
[
  {
    "message": "paragraph added to news 546 with id: 458",
    "status": 200
  }
]
```

### Comment

#### Post comment

```http
  POST /news/comments/:newsId
```

```http
  Authorization: Bearer token
  Content-Type: application/json
```

| Parameter | Type     | Description  |
| :-------- | :------- | :----------- |
| `content` | `string` | **Required** |

Response:

```json
[
  {
    "message": "comment added with id: 100"
  }
]
```

#### Delete comment

```http
  DELETE news/comments/commentid/:commentId
```

```http
  Authorization: Bearer token
```

Response:

```json
[
  {
    "message": "Comment id 100 deleted"
  }
]
```

#### Modify comment

```http
  PUT /news/comments/:newsId
```

```http
  Authorization: Bearer token
  Content-Type: application/json
```

| Parameter | Type     | Description  |
| :-------- | :------- | :----------- |
| `content` | `string` | **Required** |

Response:

```json
[
  {
    "message": "Comment updated: true"
  }
]
```

### Bookmark

#### Add news to bookmark

```http
  POST /news/favorite/:newsId
```

```http
  Authorization: Bearer token
```

Response:

```json
[
  {
    "message": "This news has been added to your favorite list",
    "status": 200
  }
]
```

#### Remove news from bookmark

```http
  DELETE /news/favorite/:newsId
```

```http
  Authorization: Bearer token
```

Response:

```json
[
  {
    "message": "This news has been removed from your favorite list",
    "status": 200
  }
]
```

#### Get bookmark list of use

```http
  GET /news/favorite/:newsId
```

```http
  Authorization: Bearer token
```

Response:

```json
[
  {
    "message": "Favorite news not found",
    "status": 409
  }
]
```

### Like news

#### Like a news

```http
  POST /news/user/like/:newsId
```

```http
  Authorization: Bearer token
```

Response:

```json
[
  {
    "message": "You have liked this news",
    "status": 200
  }
]
```

#### Remove like to a news

```http
  DELETE /news/user/like/:likeId
```

```http
  Authorization: Bearer token
```

Response:

```json
[
  {
    "message": "You no longer like this news",
    "status": 200
  }
]
```

#### Get number of likes of a news

```http
  GET /news/user/like/:newsId
```

```http
  Authorization: Bearer token
```

Response:

```json
[
  {
    "like": 3
  }
]
```

### Number of view of a news

#### Get number of view of a news

```http
  GET /news/user/like/:newsId
```

```http
  Authorization: Bearer token
```

Response:

```json
[
  [
    {
      "news_id": 478,
      "count": 3
    }
  ]
]
```

### Highlighted news

#### Update news highlight status

```http
  PUT /news/highlighted/:newsId
```

```http
  Authorization: Bearer token
```

Response:

```json
[
  [
    {
      "message": "News hightlighted updated: true"
    }
  ]
]
```

## CONTRIBUTORS

[Xiaoming Ma](https://github.com/myxmxm)<br>
[Nischhal Shrestha](https://github.com/Nischhal3) <br>
[Boris Hoi](https://github.com/Borissss420)<br>
