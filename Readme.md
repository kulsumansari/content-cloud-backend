
# 📦 Delivery API Documentation

The Delivery API provides read-only access to content models, entries, and assets. Each API request must include a valid `access_token` and `ws_api_key` in the headers for authentication.

---

## 🔐 Authentication

All routes require **authentication headers**:

| Header        | Type   | Description                       |
|---------------|--------|-----------------------------------|
| `ws_api_key`  | string | Workspace identifier              |
| `access_token`| string | Token used to validate requests   |

The token is matched against a stored value in the workspace’s `configuration`.

---

## 📁 Content Models

### 🔹 Get All Content Models

**GET** `/delivery-api/content-model`

Fetches all content models within the workspace.

#### Headers
- `ws_api_key`: Workspace identifier  
- `access_token`: Valid access token

#### Response
```json
[
  {
    "schema_uid": "blog",
    "schema_name": "Blog",
    ...
  }
]
```

---

### 🔹 Get Content Model by UID

**GET** `/delivery-api/content-model/:uid`

Fetch a single content model using its UID.

#### Parameters
- `uid`: Content model UID

#### Headers
- `ws_api_key`
- `access_token`

#### Response
```json
{
  "schema_uid": "blog",
  "schema_name": "Blog",
  ...
}
```

---

## 📝 Entries

> 🔓 These endpoints are public and **do not require** authentication headers.

### 🔹 Get All Entries by Model UID

**GET** `/delivery-api/content-model/:modelUid/entries`

Fetch all entries for a specific content model.

#### Parameters
- `modelUid`: UID of the content model

#### Response
```json
[
  {
    "entry_uid": "entrxxxxxxxxx",
    "title": "First Entry",
    ...
  }
]
```

---

### 🔹 Get Entry by UID

**GET** `/delivery-api/content-model/:modelUid/entries/:entryUid`

Fetch a single entry by its UID.

#### Parameters
- `modelUid`: UID of the content model  
- `entryUid`: UID of the specific entry

#### Response
```json
{
  "entry_uid": "entry1",
  "title": "First Entry",
  ...
}
```

---

## 🖼️ Assets

### 🔹 Get All Assets

**GET** `/delivery-api/assets`

Retrieve all available assets.

#### Headers
- `ws_api_key`
- `access_token`

#### Response
```json
[
  {
    "asset_uid": "asstxxxxxxxxx",
    "url": "https://assetbaseurl/asset.jpg",
    ...
  }
]
```

---

### 🔹 Get Asset by UID

**GET** `/delivery-api/assets/:assetUid`

Fetch a specific asset using its UID.

#### Parameters
- `assetUid`: UID of the asset

#### Headers
- `ws_api_key`
- `access_token`

#### Response
```json
{
  "asset_uid": "asstxxxxxxxxx",
  "url": "https://assetbaseurl/asset.jpg",
  ...
}
```

---

## ❗Error Responses

| Status Code | Description                              |
|-------------|------------------------------------------|
| 401         | Invalid access_token                     |
| 404         | Content not found                        |
| 500         | Internal server error                    |

---

## 📌 Notes
- Make sure `ws_api_key` maps to the correct workspace UID, which can be found in your workspace configuration.
- `access_token` must match the one configured in the workspace's configuration.

---