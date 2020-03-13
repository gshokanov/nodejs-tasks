## Database
Contains 1 schema called `public`.  
### User
Following structure is used:
```sql
CREATE TABLE public.users
(
    age integer NOT NULL,
    id uuid NOT NULL,
    login character varying(50) COLLATE pg_catalog."default" NOT NULL,
    password character varying(50) COLLATE pg_catalog."default" NOT NULL,
    "isDeleted" boolean NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id)
)
```

## Endpoints
### User
**GET** `/api/user/autosuggest?loginSubstring={loginSubstring}&limit={1-*}`  
Returns array of user records that match the following condition: login starts with provided login substring.    
**GET** `/api/user/{id}`  
Returns JSON containing user record.  
**POST** `/api/user`  
Creates new user and returns assigned id. Expects JSON body of following type:
```json
{
  "login": "string",
  "password": "string",
  "age": "number"
}
```
**PUT** `/api/user/{id}`  
Modify existing user. Expects the same body as POST request.  
**DELETE** `/api/user/{id}`  
Delete existing user.  
