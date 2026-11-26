{
    "openapi": "3.1.0",
    "info": {
        "title": "NexusMind API",
        "version": "v1.0"
    },
    "servers": [
        {
            "url": "https://api.nexusmind.az",
            "description": "Generated server url"
        }
    ],
    "security": [
        {
            "bearerAuth": []
        }
    ],
    "paths": {
        "/xeber/{id}": {
            "get": {
                "tags": [
                    "news-controller"
                ],
                "operationId": "getById",
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "integer",
                            "format": "int64"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "$ref": "#/components/schemas/XeberResponseDto"
                                }
                            }
                        }
                    }
                }
            },
            "put": {
                "tags": [
                    "news-controller"
                ],
                "operationId": "update",
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "integer",
                            "format": "int64"
                        }
                    }
                ],
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/XeberRequestDto"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "$ref": "#/components/schemas/XeberResponseDto"
                                }
                            }
                        }
                    }
                }
            },
            "delete": {
                "tags": [
                    "news-controller"
                ],
                "operationId": "delete",
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "integer",
                            "format": "int64"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK"
                    }
                }
            }
        },
        "/trainings/{id}": {
            "put": {
                "tags": [
                    "training-controller"
                ],
                "operationId": "update_1",
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "integer",
                            "format": "int64"
                        }
                    }
                ],
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/TrainingRequest"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "$ref": "#/components/schemas/TrainingResponse"
                                }
                            }
                        }
                    }
                }
            },
            "delete": {
                "tags": [
                    "training-controller"
                ],
                "operationId": "delete_1",
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "integer",
                            "format": "int64"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK"
                    }
                }
            }
        },
        "/profile/status": {
            "put": {
                "tags": [
                    "profile-controller"
                ],
                "operationId": "updateStatus",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/UpdateProfileStatusRequest"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "$ref": "#/components/schemas/ProfileResponse"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/profile/name": {
            "put": {
                "tags": [
                    "profile-controller"
                ],
                "operationId": "updateName",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/UpdateNameRequest"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "$ref": "#/components/schemas/ProfileResponse"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/profile/language": {
            "put": {
                "tags": [
                    "profile-controller"
                ],
                "operationId": "updateLanguage",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/UpdateLanguageRequest"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "$ref": "#/components/schemas/ProfileResponse"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/profile/email": {
            "put": {
                "tags": [
                    "profile-controller"
                ],
                "operationId": "updateEmail",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/UpdateEmailRequest"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "$ref": "#/components/schemas/ProfileResponse"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/profile/2fa": {
            "put": {
                "tags": [
                    "profile-controller"
                ],
                "operationId": "updateTwoFactor",
                "parameters": [
                    {
                        "name": "enabled",
                        "in": "query",
                        "required": true,
                        "schema": {
                            "type": "boolean"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "type": "string"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/meqale/{id}": {
            "get": {
                "tags": [
                    "article-controller"
                ],
                "operationId": "getById_1",
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "integer",
                            "format": "int64"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "$ref": "#/components/schemas/MeqaleResponseDto"
                                }
                            }
                        }
                    }
                }
            },
            "put": {
                "tags": [
                    "article-controller"
                ],
                "operationId": "update_2",
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "integer",
                            "format": "int64"
                        }
                    }
                ],
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/MeqaleRequestDto"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "$ref": "#/components/schemas/MeqaleResponseDto"
                                }
                            }
                        }
                    }
                }
            },
            "delete": {
                "tags": [
                    "article-controller"
                ],
                "operationId": "delete_2",
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "integer",
                            "format": "int64"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK"
                    }
                }
            }
        },
        "/gallery/{id}": {
            "put": {
                "tags": [
                    "gallery-controller"
                ],
                "operationId": "update_3",
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "integer",
                            "format": "int64"
                        }
                    }
                ],
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/GalleryItemRequest"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "$ref": "#/components/schemas/GalleryItemResponse"
                                }
                            }
                        }
                    }
                }
            },
            "delete": {
                "tags": [
                    "gallery-controller"
                ],
                "operationId": "delete_3",
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "integer",
                            "format": "int64"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK"
                    }
                }
            }
        },
        "/doctors/{doctorId}/prices/{priceId}": {
            "put": {
                "tags": [
                    "doctor-price-controller"
                ],
                "operationId": "update_4",
                "parameters": [
                    {
                        "name": "doctorId",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "integer",
                            "format": "int64"
                        }
                    },
                    {
                        "name": "priceId",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "integer",
                            "format": "int64"
                        }
                    }
                ],
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/DoctorPriceRequest"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "$ref": "#/components/schemas/DoctorPriceResponse"
                                }
                            }
                        }
                    }
                }
            },
            "delete": {
                "tags": [
                    "doctor-price-controller"
                ],
                "operationId": "delete_4",
                "parameters": [
                    {
                        "name": "doctorId",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "integer",
                            "format": "int64"
                        }
                    },
                    {
                        "name": "priceId",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "integer",
                            "format": "int64"
                        }
                    }
                ],
                "responses": {
                    "204": {
                        "description": "No Content"
                    }
                }
            }
        },
        "/blog/{id}": {
            "get": {
                "tags": [
                    "blog-controller"
                ],
                "operationId": "getById_2",
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "integer",
                            "format": "int64"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "$ref": "#/components/schemas/BlogResponse"
                                }
                            }
                        }
                    }
                }
            },
            "put": {
                "tags": [
                    "blog-controller"
                ],
                "operationId": "update_5",
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "integer",
                            "format": "int64"
                        }
                    }
                ],
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/BlogRequest"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "$ref": "#/components/schemas/BlogResponse"
                                }
                            }
                        }
                    }
                }
            },
            "delete": {
                "tags": [
                    "blog-controller"
                ],
                "operationId": "delete_5",
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "integer",
                            "format": "int64"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK"
                    }
                }
            }
        },
        "/auth/{patientId}/mood": {
            "put": {
                "tags": [
                    "auth-controller"
                ],
                "operationId": "updateMood",
                "parameters": [
                    {
                        "name": "patientId",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "integer",
                            "format": "int64"
                        }
                    },
                    {
                        "name": "mood",
                        "in": "query",
                        "required": true,
                        "schema": {
                            "type": "string",
                            "enum": [
                                "SAD",
                                "HAPPY",
                                "TIRED",
                                "CALM",
                                "NORMAL"
                            ]
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK"
                    }
                }
            }
        },
        "/auth/{id}": {
            "get": {
                "tags": [
                    "auth-controller"
                ],
                "operationId": "getUserById",
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "integer",
                            "format": "int64"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "$ref": "#/components/schemas/PasientRegisterDto"
                                }
                            }
                        }
                    }
                }
            },
            "put": {
                "tags": [
                    "auth-controller"
                ],
                "operationId": "updateUser",
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "integer",
                            "format": "int64"
                        }
                    }
                ],
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/PasientRegisterDto"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "type": "string"
                                }
                            }
                        }
                    }
                }
            },
            "delete": {
                "tags": [
                    "auth-controller"
                ],
                "operationId": "deleteUser",
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "integer",
                            "format": "int64"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "type": "string"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/auth/change-password": {
            "put": {
                "tags": [
                    "auth-controller"
                ],
                "operationId": "changePassword",
                "parameters": [
                    {
                        "name": "Authorization",
                        "in": "header",
                        "required": true,
                        "schema": {
                            "type": "string"
                        }
                    }
                ],
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/ChangePasswordRequest"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "type": "string"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/xeber": {
            "get": {
                "tags": [
                    "news-controller"
                ],
                "operationId": "getAll",
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/XeberResponseDto"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "post": {
                "tags": [
                    "news-controller"
                ],
                "operationId": "create",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/XeberRequestDto"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "$ref": "#/components/schemas/XeberResponseDto"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/upload": {
            "post": {
                "tags": [
                    "file-upload-controller"
                ],
                "operationId": "uploadImage",
                "requestBody": {
                    "content": {
                        "multipart/form-data": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "file": {
                                        "type": "string",
                                        "format": "binary"
                                    }
                                },
                                "required": [
                                    "file"
                                ]
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "type": "string"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/trainings": {
            "get": {
                "tags": [
                    "training-controller"
                ],
                "operationId": "search",
                "parameters": [
                    {
                        "name": "type",
                        "in": "query",
                        "required": false,
                        "schema": {
                            "type": "string",
                            "enum": [
                                "ONLINE",
                                "IN_PERSON"
                            ]
                        }
                    },
                    {
                        "name": "search",
                        "in": "query",
                        "required": false,
                        "schema": {
                            "type": "string"
                        }
                    },
                    {
                        "name": "pageable",
                        "in": "query",
                        "required": true,
                        "schema": {
                            "$ref": "#/components/schemas/Pageable"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "$ref": "#/components/schemas/PageTrainingResponse"
                                }
                            }
                        }
                    }
                }
            },
            "post": {
                "tags": [
                    "training-controller"
                ],
                "operationId": "create_1",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/TrainingRequest"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "$ref": "#/components/schemas/TrainingResponse"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/trainings/{trainingId}/register": {
            "post": {
                "tags": [
                    "training-controller"
                ],
                "operationId": "register",
                "parameters": [
                    {
                        "name": "trainingId",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "integer",
                            "format": "int64"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK"
                    }
                }
            },
            "delete": {
                "tags": [
                    "training-controller"
                ],
                "operationId": "unregister",
                "parameters": [
                    {
                        "name": "trainingId",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "integer",
                            "format": "int64"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK"
                    }
                }
            }
        },
        "/sitemap.xml": {
            "get": {
                "tags": [
                    "site-settings-controller"
                ],
                "operationId": "sitemapXml",
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "application/xml": {
                                "schema": {
                                    "type": "string"
                                }
                            }
                        }
                    }
                }
            },
            "post": {
                "tags": [
                    "site-settings-controller"
                ],
                "operationId": "updateSitemapXml",
                "requestBody": {
                    "content": {
                        "application/xml": {
                            "schema": {
                                "type": "string"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "OK"
                    }
                }
            }
        },
        "/robots.txt": {
            "get": {
                "tags": [
                    "site-settings-controller"
                ],
                "operationId": "robotsTxt",
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "text/plain": {
                                "schema": {
                                    "type": "string"
                                }
                            }
                        }
                    }
                }
            },
            "post": {
                "tags": [
                    "site-settings-controller"
                ],
                "operationId": "updateRobotsTxt",
                "requestBody": {
                    "content": {
                        "text/plain": {
                            "schema": {
                                "type": "string"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "OK"
                    }
                }
            }
        },
        "/profile/photo": {
            "post": {
                "tags": [
                    "profile-controller"
                ],
                "operationId": "uploadPhoto",
                "requestBody": {
                    "content": {
                        "multipart/form-data": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "file": {
                                        "type": "string",
                                        "format": "binary"
                                    }
                                },
                                "required": [
                                    "file"
                                ]
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "$ref": "#/components/schemas/ProfileResponse"
                                }
                            }
                        }
                    }
                }
            },
            "delete": {
                "tags": [
                    "profile-controller"
                ],
                "operationId": "deletePhoto",
                "responses": {
                    "200": {
                        "description": "OK"
                    }
                }
            }
        },
        "/otp/verify": {
            "post": {
                "tags": [
                    "otp-controller"
                ],
                "operationId": "verifyOtp",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/VerifyOtpRequest"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "type": "string"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/onboarding/submit": {
            "post": {
                "tags": [
                    "onboarding-controller"
                ],
                "operationId": "submit",
                "parameters": [
                    {
                        "name": "Authorization",
                        "in": "header",
                        "required": true,
                        "schema": {
                            "type": "string"
                        }
                    }
                ],
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/OnboardingRequest"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "$ref": "#/components/schemas/OnboardingResponse"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/meqale": {
            "get": {
                "tags": [
                    "article-controller"
                ],
                "operationId": "getAll_1",
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/MeqaleResponseDto"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "post": {
                "tags": [
                    "article-controller"
                ],
                "operationId": "create_2",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/MeqaleRequestDto"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "$ref": "#/components/schemas/MeqaleResponseDto"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/llms.txt": {
            "get": {
                "tags": [
                    "site-settings-controller"
                ],
                "operationId": "llmsTxt",
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "text/plain": {
                                "schema": {
                                    "type": "string"
                                }
                            }
                        }
                    }
                }
            },
            "post": {
                "tags": [
                    "site-settings-controller"
                ],
                "operationId": "updateLlmsTxt",
                "requestBody": {
                    "content": {
                        "text/plain": {
                            "schema": {
                                "type": "string"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "OK"
                    }
                }
            }
        },
        "/journal": {
            "post": {
                "tags": [
                    "journal-controller"
                ],
                "operationId": "saveToday",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/JournalEntryRequest"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "$ref": "#/components/schemas/JournalEntryResponse"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/gallery": {
            "get": {
                "tags": [
                    "gallery-controller"
                ],
                "operationId": "getItems",
                "parameters": [
                    {
                        "name": "category",
                        "in": "query",
                        "required": false,
                        "schema": {
                            "type": "string"
                        }
                    },
                    {
                        "name": "sort",
                        "in": "query",
                        "required": false,
                        "schema": {
                            "type": "string",
                            "default": "popularity"
                        }
                    },
                    {
                        "name": "page",
                        "in": "query",
                        "required": false,
                        "schema": {
                            "type": "integer",
                            "format": "int32",
                            "default": 0
                        }
                    },
                    {
                        "name": "size",
                        "in": "query",
                        "required": false,
                        "schema": {
                            "type": "integer",
                            "format": "int32",
                            "default": 8
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "$ref": "#/components/schemas/PageGalleryItemResponse"
                                }
                            }
                        }
                    }
                }
            },
            "post": {
                "tags": [
                    "gallery-controller"
                ],
                "operationId": "create_3",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/GalleryItemRequest"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "$ref": "#/components/schemas/GalleryItemResponse"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/doctors/{doctorId}/prices": {
            "get": {
                "tags": [
                    "doctor-price-controller"
                ],
                "operationId": "getPrices",
                "parameters": [
                    {
                        "name": "doctorId",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "integer",
                            "format": "int64"
                        }
                    },
                    {
                        "name": "age",
                        "in": "query",
                        "required": false,
                        "schema": {
                            "type": "integer",
                            "format": "int32"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/DoctorPriceResponse"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "post": {
                "tags": [
                    "doctor-price-controller"
                ],
                "operationId": "create_4",
                "parameters": [
                    {
                        "name": "doctorId",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "integer",
                            "format": "int64"
                        }
                    }
                ],
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/DoctorPriceRequest"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "201": {
                        "description": "Created",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "$ref": "#/components/schemas/DoctorPriceResponse"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/doctors/register": {
            "post": {
                "tags": [
                    "doctor-controller"
                ],
                "operationId": "registerDoctor",
                "requestBody": {
                    "content": {
                        "multipart/form-data": {
                            "schema": {
                                "$ref": "#/components/schemas/DoctorRegisterDto"
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "type": "string"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/doctors/me/working-hours": {
            "get": {
                "tags": [
                    "working-hour-controller"
                ],
                "operationId": "getMyRanges",
                "parameters": [
                    {
                        "name": "from",
                        "in": "query",
                        "required": true,
                        "schema": {
                            "type": "string",
                            "format": "date"
                        }
                    },
                    {
                        "name": "to",
                        "in": "query",
                        "required": true,
                        "schema": {
                            "type": "string",
                            "format": "date"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/WorkingRangeDto"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "post": {
                "tags": [
                    "working-hour-controller"
                ],
                "operationId": "addMyRange",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/WorkingHourRangeRequest"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "OK"
                    }
                }
            }
        },
        "/doctors/me/working-hours/batch": {
            "post": {
                "tags": [
                    "working-hour-controller"
                ],
                "operationId": "addMyWorkingHoursBatch",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/WorkingHoursBatchRequest"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "OK"
                    }
                }
            }
        },
        "/blog": {
            "get": {
                "tags": [
                    "blog-controller"
                ],
                "operationId": "getAll_2",
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/BlogResponse"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "post": {
                "tags": [
                    "blog-controller"
                ],
                "operationId": "create_5",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/BlogRequest"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "$ref": "#/components/schemas/BlogResponse"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/auth/upload": {
            "post": {
                "tags": [
                    "auth-controller"
                ],
                "operationId": "uploadRegistrationImage",
                "requestBody": {
                    "content": {
                        "multipart/form-data": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "file": {
                                        "type": "string",
                                        "format": "binary"
                                    }
                                },
                                "required": [
                                    "file"
                                ]
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "type": "string"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/auth/super-admin-login": {
            "post": {
                "tags": [
                    "auth-controller"
                ],
                "operationId": "superAdminLogin",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/AdminLoginRequest"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "$ref": "#/components/schemas/AuthResponse"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/auth/reset-password": {
            "post": {
                "tags": [
                    "auth-controller"
                ],
                "operationId": "resetPassword",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/ResetPasswordWithOtpRequest"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "type": "string"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/auth/refresh": {
            "post": {
                "tags": [
                    "auth-controller"
                ],
                "operationId": "refresh",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/RefreshTokenRequest"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "$ref": "#/components/schemas/AuthResponse"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/auth/logout": {
            "post": {
                "tags": [
                    "auth-controller"
                ],
                "operationId": "logout",
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "type": "string"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/auth/login": {
            "post": {
                "tags": [
                    "auth-controller"
                ],
                "operationId": "login",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/LoginRequest"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "$ref": "#/components/schemas/AuthResponse"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/auth/forgot-password": {
            "post": {
                "tags": [
                    "auth-controller"
                ],
                "operationId": "forgotPassword",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/ForgotPasswordRequest"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "type": "string"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/auth/doctor-panel-login": {
            "post": {
                "tags": [
                    "auth-controller"
                ],
                "operationId": "doctorPanelLogin",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/DoctorLoginRequest"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "$ref": "#/components/schemas/AuthResponse"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/auth/doctor-login": {
            "post": {
                "tags": [
                    "auth-controller"
                ],
                "operationId": "doctorLogin",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/LoginRequest"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "$ref": "#/components/schemas/AuthResponse"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/auth/bpm-login": {
            "post": {
                "tags": [
                    "auth-controller"
                ],
                "operationId": "bpmLogin",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/AdminLoginRequest"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "$ref": "#/components/schemas/AuthResponse"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/auth/add": {
            "post": {
                "tags": [
                    "auth-controller"
                ],
                "operationId": "addPasient",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/PasientRegisterDto"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "type": "string"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/appointments": {
            "get": {
                "tags": [
                    "appointment-controller"
                ],
                "operationId": "getMyAppointments",
                "parameters": [
                    {
                        "name": "range",
                        "in": "query",
                        "required": false,
                        "schema": {
                            "type": "string"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/AppointmentDto"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "post": {
                "tags": [
                    "appointment-controller"
                ],
                "operationId": "create_6",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/CreateAppointmentRequest"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "$ref": "#/components/schemas/AppointmentDto"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/appointments/{id}/notes": {
            "get": {
                "tags": [
                    "appointment-controller"
                ],
                "operationId": "getNote",
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "integer",
                            "format": "int64"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "$ref": "#/components/schemas/SessionNoteDto"
                                }
                            }
                        }
                    }
                }
            },
            "post": {
                "tags": [
                    "appointment-controller"
                ],
                "operationId": "addNote",
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "integer",
                            "format": "int64"
                        }
                    }
                ],
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/CreateSessionNoteRequest"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "$ref": "#/components/schemas/SessionNoteDto"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/appointments/{id}/join-token": {
            "post": {
                "tags": [
                    "appointment-controller"
                ],
                "operationId": "getJoinToken",
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "integer",
                            "format": "int64"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "type": "object",
                                    "additionalProperties": {
                                        "type": "string"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/appointments/doctors/me/profile-image": {
            "post": {
                "tags": [
                    "appointment-controller"
                ],
                "operationId": "uploadProfileImage",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "file": {
                                        "type": "string",
                                        "format": "binary"
                                    }
                                },
                                "required": [
                                    "file"
                                ]
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "type": "object",
                                    "additionalProperties": {
                                        "type": "string"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/appointments/compare-face": {
            "post": {
                "tags": [
                    "appointment-controller"
                ],
                "operationId": "comparePatientFace",
                "requestBody": {
                    "content": {
                        "multipart/form-data": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "file": {
                                        "type": "string",
                                        "format": "binary"
                                    }
                                },
                                "required": [
                                    "file"
                                ]
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "type": "boolean"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/api/webhooks/livekit": {
            "post": {
                "tags": [
                    "webhook-controller"
                ],
                "operationId": "receiveWebhook",
                "parameters": [
                    {
                        "name": "Authorization",
                        "in": "header",
                        "required": true,
                        "schema": {
                            "type": "string"
                        }
                    }
                ],
                "requestBody": {
                    "content": {
                        "application/webhook+json": {
                            "schema": {
                                "type": "string"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "type": "string"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/api/payments/start": {
            "post": {
                "tags": [
                    "payment-controller"
                ],
                "operationId": "start",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/StartPaymentRequest"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "type": "object",
                                    "additionalProperties": {
                                        "type": "string"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/api/payments/callback": {
            "post": {
                "tags": [
                    "payment-controller"
                ],
                "operationId": "callback",
                "requestBody": {
                    "content": {
                        "application/x-www-form-urlencoded": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "data": {
                                        "type": "string"
                                    },
                                    "signature": {
                                        "type": "string"
                                    }
                                },
                                "required": [
                                    "data",
                                    "signature"
                                ]
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "OK"
                    }
                }
            }
        },
        "/api/notifications/email": {
            "post": {
                "tags": [
                    "notification-controller"
                ],
                "operationId": "sendEmail",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/EmailNotificationRequest"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "$ref": "#/components/schemas/EmailNotificationResponse"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/api/calls/{appointmentId}/invite": {
            "post": {
                "tags": [
                    "call-invite-controller"
                ],
                "operationId": "invite",
                "parameters": [
                    {
                        "name": "appointmentId",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "integer",
                            "format": "int64"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "type": "object",
                                    "additionalProperties": {
                                        "type": "string"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/api/calls/{appointmentId}/extend": {
            "post": {
                "tags": [
                    "call-invite-controller"
                ],
                "operationId": "extend",
                "parameters": [
                    {
                        "name": "appointmentId",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "integer",
                            "format": "int64"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK"
                    }
                }
            }
        },
        "/api/calls/join/{inviteToken}": {
            "post": {
                "tags": [
                    "call-invite-controller"
                ],
                "operationId": "join",
                "parameters": [
                    {
                        "name": "inviteToken",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "string"
                        }
                    }
                ],
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "additionalProperties": {
                                    "type": "string"
                                }
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "type": "object",
                                    "additionalProperties": {
                                        "type": "string"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/api/auth/reset-password": {
            "post": {
                "tags": [
                    "password-reset-controller"
                ],
                "operationId": "resetPassword_1",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/ResetPasswordRequest"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "type": "object",
                                    "additionalProperties": {
                                        "type": "string"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/api/auth/forgot-password": {
            "post": {
                "tags": [
                    "password-reset-controller"
                ],
                "operationId": "forgotPassword_1",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/ForgotPasswordRequest"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "type": "object",
                                    "additionalProperties": {
                                        "type": "string"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/appointments/{id}/status": {
            "patch": {
                "tags": [
                    "appointment-controller"
                ],
                "operationId": "updateStatus_1",
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "integer",
                            "format": "int64"
                        }
                    }
                ],
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/UpdateUserStatusRequest"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "$ref": "#/components/schemas/AppointmentDto"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/appointments/{id}/cancel": {
            "patch": {
                "tags": [
                    "appointment-controller"
                ],
                "operationId": "cancel",
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "integer",
                            "format": "int64"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "$ref": "#/components/schemas/AppointmentDto"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/xeber/search": {
            "get": {
                "tags": [
                    "news-controller"
                ],
                "operationId": "search_1",
                "parameters": [
                    {
                        "name": "keyword",
                        "in": "query",
                        "required": true,
                        "schema": {
                            "type": "string"
                        }
                    },
                    {
                        "name": "pageable",
                        "in": "query",
                        "required": true,
                        "schema": {
                            "$ref": "#/components/schemas/Pageable"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "$ref": "#/components/schemas/PageXeberResponseDto"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/xeber/category/{category}": {
            "get": {
                "tags": [
                    "news-controller"
                ],
                "operationId": "getByCategory",
                "parameters": [
                    {
                        "name": "category",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "string"
                        }
                    },
                    {
                        "name": "pageable",
                        "in": "query",
                        "required": true,
                        "schema": {
                            "$ref": "#/components/schemas/Pageable"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "$ref": "#/components/schemas/PageXeberResponseDto"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/xeber/admin/all": {
            "get": {
                "tags": [
                    "news-controller"
                ],
                "operationId": "getAllForAdmin",
                "parameters": [
                    {
                        "name": "pageable",
                        "in": "query",
                        "required": true,
                        "schema": {
                            "$ref": "#/components/schemas/Pageable"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "$ref": "#/components/schemas/PageXeberResponseDto"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/upload/{filename}": {
            "get": {
                "tags": [
                    "file-upload-controller"
                ],
                "operationId": "download",
                "parameters": [
                    {
                        "name": "filename",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "string"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "type": "string",
                                    "format": "binary"
                                }
                            }
                        }
                    }
                }
            },
            "delete": {
                "tags": [
                    "file-upload-controller"
                ],
                "operationId": "delete_6",
                "parameters": [
                    {
                        "name": "filename",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "string"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK"
                    }
                }
            }
        },
        "/trainings/type-counts": {
            "get": {
                "tags": [
                    "training-controller"
                ],
                "operationId": "getTypeCounts",
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/TrainingTypeCountResponse"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/trainings/popular-tags": {
            "get": {
                "tags": [
                    "training-controller"
                ],
                "operationId": "getPopularTags",
                "parameters": [
                    {
                        "name": "limit",
                        "in": "query",
                        "required": false,
                        "schema": {
                            "type": "integer",
                            "format": "int32",
                            "default": 10
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "type": "string"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/trainings/calendar": {
            "get": {
                "tags": [
                    "training-controller"
                ],
                "operationId": "getMonth",
                "parameters": [
                    {
                        "name": "year",
                        "in": "query",
                        "required": true,
                        "schema": {
                            "type": "integer",
                            "format": "int32"
                        }
                    },
                    {
                        "name": "month",
                        "in": "query",
                        "required": true,
                        "schema": {
                            "type": "integer",
                            "format": "int32"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/TrainingResponse"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/site-settings/scripts": {
            "get": {
                "tags": [
                    "site-settings-controller"
                ],
                "operationId": "getPublicScripts",
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "$ref": "#/components/schemas/SiteSettingsResponseDto"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/search/journal": {
            "get": {
                "tags": [
                    "search-controller"
                ],
                "operationId": "searchJournal",
                "parameters": [
                    {
                        "name": "q",
                        "in": "query",
                        "required": true,
                        "schema": {
                            "type": "string"
                        }
                    },
                    {
                        "name": "page",
                        "in": "query",
                        "required": false,
                        "schema": {
                            "type": "integer",
                            "format": "int32",
                            "default": 0
                        }
                    },
                    {
                        "name": "size",
                        "in": "query",
                        "required": false,
                        "schema": {
                            "type": "integer",
                            "format": "int32",
                            "default": 10
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/JournalEntryResponse"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/search/doctors": {
            "get": {
                "tags": [
                    "search-controller"
                ],
                "operationId": "searchDoctors",
                "parameters": [
                    {
                        "name": "q",
                        "in": "query",
                        "required": true,
                        "schema": {
                            "type": "string"
                        }
                    },
                    {
                        "name": "lang",
                        "in": "query",
                        "required": false,
                        "schema": {
                            "type": "string",
                            "default": "az"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/DoctorSearchResult"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/search/content": {
            "get": {
                "tags": [
                    "search-controller"
                ],
                "operationId": "searchContent",
                "parameters": [
                    {
                        "name": "q",
                        "in": "query",
                        "required": true,
                        "schema": {
                            "type": "string"
                        }
                    },
                    {
                        "name": "lang",
                        "in": "query",
                        "required": false,
                        "schema": {
                            "type": "string",
                            "default": "az"
                        }
                    },
                    {
                        "name": "page",
                        "in": "query",
                        "required": false,
                        "schema": {
                            "type": "integer",
                            "format": "int32",
                            "default": 0
                        }
                    },
                    {
                        "name": "size",
                        "in": "query",
                        "required": false,
                        "schema": {
                            "type": "integer",
                            "format": "int32",
                            "default": 10
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/ContentSearchResult"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/onboarding/status": {
            "get": {
                "tags": [
                    "onboarding-controller"
                ],
                "operationId": "status",
                "parameters": [
                    {
                        "name": "Authorization",
                        "in": "header",
                        "required": true,
                        "schema": {
                            "type": "string"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "type": "boolean"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/onboarding/me": {
            "get": {
                "tags": [
                    "onboarding-controller"
                ],
                "operationId": "getMine",
                "parameters": [
                    {
                        "name": "Authorization",
                        "in": "header",
                        "required": true,
                        "schema": {
                            "type": "string"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "$ref": "#/components/schemas/OnboardingResponse"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/nexusmind/patients": {
            "get": {
                "tags": [
                    "super-admin-controller"
                ],
                "operationId": "getAllPatients",
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/PasientResponseDto"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/nexusmind/doctors": {
            "get": {
                "tags": [
                    "super-admin-controller"
                ],
                "operationId": "getAllDoctors",
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/DoctorResponseDto"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/meqale/search": {
            "get": {
                "tags": [
                    "article-controller"
                ],
                "operationId": "search_2",
                "parameters": [
                    {
                        "name": "keyword",
                        "in": "query",
                        "required": true,
                        "schema": {
                            "type": "string"
                        }
                    },
                    {
                        "name": "pageable",
                        "in": "query",
                        "required": true,
                        "schema": {
                            "$ref": "#/components/schemas/Pageable"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "$ref": "#/components/schemas/PageMeqaleResponseDto"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/meqale/category/{category}": {
            "get": {
                "tags": [
                    "article-controller"
                ],
                "operationId": "getByCategory_1",
                "parameters": [
                    {
                        "name": "category",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "string"
                        }
                    },
                    {
                        "name": "pageable",
                        "in": "query",
                        "required": true,
                        "schema": {
                            "$ref": "#/components/schemas/Pageable"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "$ref": "#/components/schemas/PageMeqaleResponseDto"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/meqale/admin/all": {
            "get": {
                "tags": [
                    "article-controller"
                ],
                "operationId": "getAllForAdmin_1",
                "parameters": [
                    {
                        "name": "pageable",
                        "in": "query",
                        "required": true,
                        "schema": {
                            "$ref": "#/components/schemas/Pageable"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "$ref": "#/components/schemas/PageMeqaleResponseDto"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/journal/{id}": {
            "get": {
                "tags": [
                    "journal-controller"
                ],
                "operationId": "getById_3",
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "integer",
                            "format": "int64"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "$ref": "#/components/schemas/JournalEntryResponse"
                                }
                            }
                        }
                    }
                }
            },
            "delete": {
                "tags": [
                    "journal-controller"
                ],
                "operationId": "delete_7",
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "integer",
                            "format": "int64"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK"
                    }
                }
            }
        },
        "/journal/today": {
            "get": {
                "tags": [
                    "journal-controller"
                ],
                "operationId": "getToday",
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "$ref": "#/components/schemas/JournalEntryResponse"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/journal/history": {
            "get": {
                "tags": [
                    "journal-controller"
                ],
                "operationId": "getHistory",
                "parameters": [
                    {
                        "name": "page",
                        "in": "query",
                        "required": false,
                        "schema": {
                            "type": "integer",
                            "format": "int32",
                            "default": 0
                        }
                    },
                    {
                        "name": "size",
                        "in": "query",
                        "required": false,
                        "schema": {
                            "type": "integer",
                            "format": "int32",
                            "default": 10
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "$ref": "#/components/schemas/PageJournalEntryResponse"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/doctors": {
            "get": {
                "tags": [
                    "doctor-profile-controller"
                ],
                "operationId": "getAllDoctors_1",
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/DoctorDto"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/doctors/{id}": {
            "get": {
                "tags": [
                    "doctor-profile-controller"
                ],
                "operationId": "getDoctorProfile",
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "integer",
                            "format": "int64"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "$ref": "#/components/schemas/DoctorDto"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/doctors/{doctorId}/working-hours/available": {
            "get": {
                "tags": [
                    "working-hour-controller"
                ],
                "operationId": "getAvailableSlots",
                "parameters": [
                    {
                        "name": "doctorId",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "integer",
                            "format": "int64"
                        }
                    },
                    {
                        "name": "from",
                        "in": "query",
                        "required": true,
                        "schema": {
                            "type": "string",
                            "format": "date"
                        }
                    },
                    {
                        "name": "to",
                        "in": "query",
                        "required": true,
                        "schema": {
                            "type": "string",
                            "format": "date"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/AvailableSlotDto"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/doctors/me/patients": {
            "get": {
                "tags": [
                    "doctor-controller"
                ],
                "operationId": "getMyPatients",
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/PasientResponseDto"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/doctors/doctors": {
            "get": {
                "tags": [
                    "doctor-controller"
                ],
                "operationId": "getAllDoctors_2",
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/DoctorResponseDto"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/chat/{appointmentId}/messages": {
            "get": {
                "tags": [
                    "chat-rest-controller"
                ],
                "operationId": "getMessages",
                "parameters": [
                    {
                        "name": "appointmentId",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "integer",
                            "format": "int64"
                        }
                    },
                    {
                        "name": "Authorization",
                        "in": "header",
                        "required": true,
                        "schema": {
                            "type": "string"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/ChatMessageResponseDto"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/bpm/patients": {
            "get": {
                "tags": [
                    "bpm-controller"
                ],
                "operationId": "getPatients",
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/PasientRegisterEntity"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/bpm/doctors": {
            "get": {
                "tags": [
                    "bpm-controller"
                ],
                "operationId": "getDoctors",
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/DoctorResponseDto"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/blog/search": {
            "get": {
                "tags": [
                    "blog-controller"
                ],
                "operationId": "search_3",
                "parameters": [
                    {
                        "name": "keyword",
                        "in": "query",
                        "required": true,
                        "schema": {
                            "type": "string"
                        }
                    },
                    {
                        "name": "pageable",
                        "in": "query",
                        "required": true,
                        "schema": {
                            "$ref": "#/components/schemas/Pageable"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "$ref": "#/components/schemas/PageBlogResponse"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/blog/category/{category}": {
            "get": {
                "tags": [
                    "blog-controller"
                ],
                "operationId": "getByCategory_2",
                "parameters": [
                    {
                        "name": "category",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "string"
                        }
                    },
                    {
                        "name": "pageable",
                        "in": "query",
                        "required": true,
                        "schema": {
                            "$ref": "#/components/schemas/Pageable"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "$ref": "#/components/schemas/PageBlogResponse"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/auth": {
            "get": {
                "tags": [
                    "auth-controller"
                ],
                "operationId": "getAllUsers",
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/PasientRegisterDto"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/auth/validate": {
            "get": {
                "tags": [
                    "auth-controller"
                ],
                "operationId": "validate",
                "parameters": [
                    {
                        "name": "Authorization",
                        "in": "header",
                        "required": true,
                        "schema": {
                            "type": "string"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "type": "boolean"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/appointments/{doctorId}": {
            "get": {
                "tags": [
                    "appointment-controller"
                ],
                "operationId": "getById_4",
                "parameters": [
                    {
                        "name": "doctorId",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "integer",
                            "format": "int64"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/AppointmentDto"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/appointments/stats": {
            "get": {
                "tags": [
                    "appointment-controller"
                ],
                "operationId": "getStats",
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "$ref": "#/components/schemas/AppointmentStatsDto"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/appointments/doctor/stats": {
            "get": {
                "tags": [
                    "appointment-controller"
                ],
                "operationId": "getDoctorStats",
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "$ref": "#/components/schemas/AppointmentStatsDto"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/api/notifications/templates": {
            "get": {
                "tags": [
                    "notification-controller"
                ],
                "operationId": "getTemplates",
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "*/*": {
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "type": "string",
                                        "enum": [
                                            "SESSION_REMINDER_24H",
                                            "SESSION_REMINDER_3H",
                                            "SESSION_REMINDER_30MIN",
                                            "OTP_CODE",
                                            "SESSION_CONFIRMED",
                                            "RESCHEDULE_CONFIRMED",
                                            "RESCHEDULE_REQUEST",
                                            "SPECIALIST_AVAILABILITY",
                                            "PAYMENT_RECEIPT",
                                            "SESSION_FEEDBACK",
                                            "RECOMMENDED_MATERIALS",
                                            "MILESTONE",
                                            "HABIT_DAILY",
                                            "MOOD_CHECK",
                                            "BREATHING",
                                            "JOURNAL",
                                            "PSYCH_FACT",
                                            "DAILY_RECOMMENDATION",
                                            "PODCAST_AND_BOOK_OF_DAY",
                                            "SCHEDULE_UPDATED",
                                            "FAVORITE_AVAILABLE",
                                            "WELCOME",
                                            "GUIDE_NEKSI",
                                            "FIRST_SESSION",
                                            "INACTIVE_15_DAYS",
                                            "INACTIVE_30_DAYS",
                                            "INACTIVE_60_DAYS",
                                            "NEW_SPECIALISTS"
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/nexusmind/doctors/{id}": {
            "delete": {
                "tags": [
                    "super-admin-controller"
                ],
                "operationId": "deleteDoctor",
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "integer",
                            "format": "int64"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK"
                    }
                }
            }
        },
        "/doctors/me/working-hours/{rangeId}": {
            "delete": {
                "tags": [
                    "working-hour-controller"
                ],
                "operationId": "deleteMyRange",
                "parameters": [
                    {
                        "name": "rangeId",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "integer",
                            "format": "int64"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK"
                    }
                }
            }
        }
    },
    "components": {
        "schemas": {
            "TitleDto": {
                "type": "object",
                "properties": {
                    "az": {
                        "type": "string",
                        "example": "Mətn (AZ)"
                    },
                    "en": {
                        "type": "string",
                        "example": "Text (EN)"
                    },
                    "ru": {
                        "type": "string",
                        "example": "Текст (RU)"
                    }
                }
            },
            "XeberRequestDto": {
                "type": "object",
                "properties": {
                    "title": {
                        "$ref": "#/components/schemas/TitleDto"
                    },
                    "shortDescription": {
                        "$ref": "#/components/schemas/TitleDto"
                    },
                    "introText": {
                        "$ref": "#/components/schemas/TitleDto"
                    },
                    "sections": {
                        "type": "array",
                        "items": {
                            "$ref": "#/components/schemas/XeberSectionRequestDto"
                        }
                    },
                    "quote": {
                        "type": "string"
                    },
                    "quoteAuthor": {
                        "type": "string"
                    },
                    "imageUrl": {
                        "type": "string"
                    },
                    "category": {
                        "type": "string"
                    },
                    "readTimeMinutes": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "status": {
                        "type": "string",
                        "enum": [
                            "DRAFT",
                            "PUBLISHED",
                            "ARCHIVED"
                        ]
                    },
                    "metaTitle": {
                        "type": "string"
                    },
                    "metaDescription": {
                        "$ref": "#/components/schemas/TitleDto"
                    },
                    "slug": {
                        "type": "string"
                    },
                    "schemaMarkup": {
                        "type": "string"
                    },
                    "metaKeywords": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    }
                },
                "required": [
                    "title"
                ]
            },
            "XeberSectionRequestDto": {
                "type": "object",
                "properties": {
                    "title": {
                        "$ref": "#/components/schemas/TitleDto"
                    },
                    "text": {
                        "$ref": "#/components/schemas/TitleDto"
                    }
                }
            },
            "XeberResponseDto": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "title": {
                        "$ref": "#/components/schemas/TitleDto"
                    },
                    "shortDescription": {
                        "$ref": "#/components/schemas/TitleDto"
                    },
                    "introText": {
                        "$ref": "#/components/schemas/TitleDto"
                    },
                    "sections": {
                        "type": "array",
                        "items": {
                            "$ref": "#/components/schemas/XeberSectionResponseDto"
                        }
                    },
                    "quote": {
                        "type": "string"
                    },
                    "quoteAuthor": {
                        "type": "string"
                    },
                    "keywords": {
                        "type": "string"
                    },
                    "imageUrl": {
                        "type": "string"
                    },
                    "category": {
                        "type": "string"
                    },
                    "readTimeMinutes": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "viewCount": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "metaTitle": {
                        "type": "string"
                    },
                    "metaDescription": {
                        "$ref": "#/components/schemas/TitleDto"
                    },
                    "slug": {
                        "type": "string"
                    },
                    "schemaMarkup": {
                        "type": "string"
                    },
                    "metaKeywords": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    },
                    "status": {
                        "type": "string",
                        "enum": [
                            "DRAFT",
                            "PUBLISHED",
                            "ARCHIVED"
                        ]
                    },
                    "createdAt": {
                        "type": "string",
                        "format": "date-time"
                    },
                    "updatedAt": {
                        "type": "string",
                        "format": "date-time"
                    }
                }
            },
            "XeberSectionResponseDto": {
                "type": "object",
                "properties": {
                    "title": {
                        "$ref": "#/components/schemas/TitleDto"
                    },
                    "text": {
                        "$ref": "#/components/schemas/TitleDto"
                    },
                    "sectionOrder": {
                        "type": "integer",
                        "format": "int32"
                    }
                }
            },
            "LocalTime": {
                "type": "object",
                "properties": {
                    "hour": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "minute": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "second": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "nano": {
                        "type": "integer",
                        "format": "int32"
                    }
                }
            },
            "TrainingRequest": {
                "type": "object",
                "properties": {
                    "title": {
                        "type": "string"
                    },
                    "tags": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    },
                    "type": {
                        "type": "string",
                        "enum": [
                            "ONLINE",
                            "IN_PERSON"
                        ]
                    },
                    "trainingDate": {
                        "type": "string",
                        "format": "date"
                    },
                    "trainingTime": {
                        "$ref": "#/components/schemas/LocalTime"
                    },
                    "location": {
                        "type": "string"
                    },
                    "priceAzn": {
                        "type": "number"
                    },
                    "imageUrl": {
                        "type": "string"
                    },
                    "live": {
                        "type": "boolean"
                    }
                },
                "required": [
                    "location",
                    "priceAzn",
                    "title",
                    "trainingDate",
                    "trainingTime",
                    "type"
                ]
            },
            "TrainingResponse": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "title": {
                        "type": "string"
                    },
                    "tags": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    },
                    "type": {
                        "type": "string"
                    },
                    "typeLabel": {
                        "type": "string"
                    },
                    "trainingDate": {
                        "type": "string",
                        "format": "date"
                    },
                    "trainingTime": {
                        "$ref": "#/components/schemas/LocalTime"
                    },
                    "location": {
                        "type": "string"
                    },
                    "priceAzn": {
                        "type": "number"
                    },
                    "imageUrl": {
                        "type": "string"
                    },
                    "live": {
                        "type": "boolean"
                    }
                }
            },
            "UpdateProfileStatusRequest": {
                "type": "object",
                "properties": {
                    "status": {
                        "type": "string",
                        "enum": [
                            "TELEBE",
                            "ISCI",
                            "DIGER"
                        ]
                    }
                },
                "required": [
                    "status"
                ]
            },
            "ProfileResponse": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "name": {
                        "type": "string"
                    },
                    "surname": {
                        "type": "string"
                    },
                    "email": {
                        "type": "string"
                    },
                    "profileImageUrl": {
                        "type": "string"
                    },
                    "status": {
                        "type": "string",
                        "enum": [
                            "TELEBE",
                            "ISCI",
                            "DIGER"
                        ]
                    },
                    "language": {
                        "type": "string",
                        "enum": [
                            "AZ",
                            "EN",
                            "RU"
                        ]
                    },
                    "twoFactorEnabled": {
                        "type": "boolean"
                    }
                }
            },
            "UpdateNameRequest": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string"
                    },
                    "surname": {
                        "type": "string"
                    }
                },
                "required": [
                    "name"
                ]
            },
            "UpdateLanguageRequest": {
                "type": "object",
                "properties": {
                    "language": {
                        "type": "string",
                        "enum": [
                            "AZ",
                            "EN",
                            "RU"
                        ]
                    }
                },
                "required": [
                    "language"
                ]
            },
            "UpdateEmailRequest": {
                "type": "object",
                "properties": {
                    "newEmail": {
                        "type": "string"
                    }
                },
                "required": [
                    "newEmail"
                ]
            },
            "MeqaleHighlightCardRequestDto": {
                "type": "object",
                "properties": {
                    "icon": {
                        "type": "string"
                    },
                    "title": {
                        "type": "string"
                    },
                    "text": {
                        "type": "string"
                    }
                }
            },
            "MeqaleRequestDto": {
                "type": "object",
                "properties": {
                    "title": {
                        "$ref": "#/components/schemas/TitleDto"
                    },
                    "shortDescription": {
                        "$ref": "#/components/schemas/TitleDto"
                    },
                    "introText": {
                        "$ref": "#/components/schemas/TitleDto"
                    },
                    "sections": {
                        "type": "array",
                        "items": {
                            "$ref": "#/components/schemas/MeqaleSectionRequestDto"
                        }
                    },
                    "quote": {
                        "type": "string"
                    },
                    "highlightCards": {
                        "type": "array",
                        "items": {
                            "$ref": "#/components/schemas/MeqaleHighlightCardRequestDto"
                        }
                    },
                    "imageUrl": {
                        "type": "string"
                    },
                    "category": {
                        "type": "string"
                    },
                    "doctorId": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "status": {
                        "type": "string",
                        "enum": [
                            "DRAFT",
                            "PUBLISHED",
                            "ARCHIVED"
                        ]
                    },
                    "keywords": {
                        "type": "string"
                    },
                    "schemaMarkup": {
                        "type": "string"
                    },
                    "metaKeywords": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    },
                    "metaTitle": {
                        "type": "string"
                    },
                    "metaDescription": {
                        "$ref": "#/components/schemas/TitleDto"
                    },
                    "slug": {
                        "type": "string"
                    }
                },
                "required": [
                    "title"
                ]
            },
            "MeqaleSectionRequestDto": {
                "type": "object",
                "properties": {
                    "title": {
                        "$ref": "#/components/schemas/TitleDto"
                    },
                    "text": {
                        "$ref": "#/components/schemas/TitleDto"
                    }
                },
                "required": [
                    "text",
                    "title"
                ]
            },
            "MeqaleHighlightCardResponseDto": {
                "type": "object",
                "properties": {
                    "icon": {
                        "type": "string"
                    },
                    "title": {
                        "type": "string"
                    },
                    "text": {
                        "type": "string"
                    },
                    "cardOrder": {
                        "type": "integer",
                        "format": "int32"
                    }
                }
            },
            "MeqaleResponseDto": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "title": {
                        "$ref": "#/components/schemas/TitleDto"
                    },
                    "shortDescription": {
                        "$ref": "#/components/schemas/TitleDto"
                    },
                    "introText": {
                        "$ref": "#/components/schemas/TitleDto"
                    },
                    "sections": {
                        "type": "array",
                        "items": {
                            "$ref": "#/components/schemas/MeqaleSectionResponseDto"
                        }
                    },
                    "quote": {
                        "type": "string"
                    },
                    "highlightCards": {
                        "type": "array",
                        "items": {
                            "$ref": "#/components/schemas/MeqaleHighlightCardResponseDto"
                        }
                    },
                    "imageUrl": {
                        "type": "string"
                    },
                    "category": {
                        "type": "string"
                    },
                    "doctorId": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "status": {
                        "type": "string",
                        "enum": [
                            "DRAFT",
                            "PUBLISHED",
                            "ARCHIVED"
                        ]
                    },
                    "createdAt": {
                        "type": "string",
                        "format": "date-time"
                    },
                    "updatedAt": {
                        "type": "string",
                        "format": "date-time"
                    },
                    "keywords": {
                        "type": "string"
                    },
                    "schemaMarkup": {
                        "type": "string"
                    },
                    "metaKeywords": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    },
                    "metaTitle": {
                        "type": "string"
                    },
                    "metaDescription": {
                        "$ref": "#/components/schemas/TitleDto"
                    },
                    "slug": {
                        "type": "string"
                    }
                }
            },
            "MeqaleSectionResponseDto": {
                "type": "object",
                "properties": {
                    "title": {
                        "$ref": "#/components/schemas/TitleDto"
                    },
                    "text": {
                        "$ref": "#/components/schemas/TitleDto"
                    },
                    "sectionOrder": {
                        "type": "integer",
                        "format": "int32"
                    }
                }
            },
            "GalleryItemRequest": {
                "type": "object",
                "properties": {
                    "title": {
                        "$ref": "#/components/schemas/TitleDto"
                    },
                    "thumbnailUrl": {
                        "type": "string"
                    },
                    "mediaUrl": {
                        "type": "string"
                    },
                    "mediaType": {
                        "type": "string",
                        "enum": [
                            "IMAGE",
                            "VIDEO"
                        ]
                    },
                    "category": {
                        "type": "string",
                        "enum": [
                            "TERAPIYALAR",
                            "OTAQLAR",
                            "TELIMLER"
                        ]
                    },
                    "altText": {
                        "$ref": "#/components/schemas/TitleDto"
                    }
                },
                "required": [
                    "category",
                    "mediaType",
                    "thumbnailUrl",
                    "title"
                ]
            },
            "GalleryItemResponse": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "title": {
                        "$ref": "#/components/schemas/TitleDto"
                    },
                    "thumbnailUrl": {
                        "type": "string"
                    },
                    "mediaUrl": {
                        "type": "string"
                    },
                    "mediaType": {
                        "type": "string"
                    },
                    "category": {
                        "type": "string"
                    },
                    "altText": {
                        "$ref": "#/components/schemas/TitleDto"
                    },
                    "categoryLabel": {
                        "type": "string"
                    },
                    "popularityScore": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "createdAt": {
                        "type": "string",
                        "format": "date-time"
                    }
                }
            },
            "DoctorPriceRequest": {
                "type": "object",
                "properties": {
                    "label": {
                        "type": "string"
                    },
                    "minAge": {
                        "type": "integer",
                        "format": "int32",
                        "minimum": 0
                    },
                    "maxAge": {
                        "type": "integer",
                        "format": "int32",
                        "minimum": 0
                    },
                    "sessionType": {
                        "type": "string"
                    },
                    "durationMin": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "durationMax": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "amount": {
                        "type": "number",
                        "minimum": 0.0
                    },
                    "currency": {
                        "type": "string"
                    }
                },
                "required": [
                    "amount",
                    "label"
                ]
            },
            "DoctorPriceResponse": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "doctorId": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "label": {
                        "type": "string"
                    },
                    "minAge": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "maxAge": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "sessionType": {
                        "type": "string"
                    },
                    "durationMin": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "durationMax": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "amount": {
                        "type": "number"
                    },
                    "currency": {
                        "type": "string"
                    }
                }
            },
            "BlogRequest": {
                "type": "object",
                "properties": {
                    "title": {
                        "$ref": "#/components/schemas/TitleDto"
                    },
                    "shortDescription": {
                        "$ref": "#/components/schemas/TitleDto"
                    },
                    "introText": {
                        "$ref": "#/components/schemas/TitleDto"
                    },
                    "sections": {
                        "type": "array",
                        "items": {
                            "$ref": "#/components/schemas/BlogSectionRequest"
                        }
                    },
                    "imageUrl": {
                        "type": "string"
                    },
                    "category": {
                        "type": "string"
                    },
                    "authorName": {
                        "type": "string"
                    },
                    "schemaMarkup": {
                        "type": "string"
                    },
                    "metaKeywords": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    },
                    "metaTitle": {
                        "type": "string"
                    },
                    "metaDescription": {
                        "$ref": "#/components/schemas/TitleDto"
                    },
                    "slug": {
                        "type": "string"
                    }
                },
                "required": [
                    "title"
                ]
            },
            "BlogSectionRequest": {
                "type": "object",
                "properties": {
                    "title": {
                        "$ref": "#/components/schemas/TitleDto"
                    },
                    "text": {
                        "$ref": "#/components/schemas/TitleDto"
                    }
                },
                "required": [
                    "text",
                    "title"
                ]
            },
            "BlogResponse": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "title": {
                        "$ref": "#/components/schemas/TitleDto"
                    },
                    "shortDescription": {
                        "$ref": "#/components/schemas/TitleDto"
                    },
                    "introText": {
                        "$ref": "#/components/schemas/TitleDto"
                    },
                    "sections": {
                        "type": "array",
                        "items": {
                            "$ref": "#/components/schemas/BlogSectionResponse"
                        }
                    },
                    "imageUrl": {
                        "type": "string"
                    },
                    "category": {
                        "type": "string"
                    },
                    "authorName": {
                        "type": "string"
                    },
                    "createdAt": {
                        "type": "string",
                        "format": "date-time"
                    },
                    "updatedAt": {
                        "type": "string",
                        "format": "date-time"
                    },
                    "schemaMarkup": {
                        "type": "string"
                    },
                    "metaKeywords": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    },
                    "metaTitle": {
                        "type": "string"
                    },
                    "metaDescription": {
                        "$ref": "#/components/schemas/TitleDto"
                    },
                    "slug": {
                        "type": "string"
                    }
                }
            },
            "BlogSectionResponse": {
                "type": "object",
                "properties": {
                    "title": {
                        "$ref": "#/components/schemas/TitleDto"
                    },
                    "text": {
                        "$ref": "#/components/schemas/TitleDto"
                    },
                    "order": {
                        "type": "integer",
                        "format": "int32"
                    }
                }
            },
            "PasientRegisterDto": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "name": {
                        "type": "string"
                    },
                    "surname": {
                        "type": "string"
                    },
                    "age": {
                        "type": "integer",
                        "format": "int32",
                        "maximum": 45,
                        "minimum": 17
                    },
                    "email": {
                        "type": "string"
                    },
                    "password": {
                        "type": "string",
                        "maxLength": 50,
                        "minLength": 8,
                        "pattern": "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).*$"
                    },
                    "phone": {
                        "type": "string",
                        "pattern": "^\\+994(50|51|55|70|77|10|99)\\d{7}$"
                    },
                    "registrationImageUrl": {
                        "type": "string"
                    }
                },
                "required": [
                    "email",
                    "name",
                    "password",
                    "surname"
                ]
            },
            "ChangePasswordRequest": {
                "type": "object",
                "properties": {
                    "oldPassword": {
                        "type": "string"
                    },
                    "newPassword": {
                        "type": "string",
                        "maxLength": 50,
                        "minLength": 8,
                        "pattern": "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).*$"
                    },
                    "confirmPassword": {
                        "type": "string"
                    }
                },
                "required": [
                    "confirmPassword",
                    "newPassword",
                    "oldPassword"
                ]
            },
            "VerifyOtpRequest": {
                "type": "object",
                "properties": {
                    "email": {
                        "type": "string"
                    },
                    "otp": {
                        "type": "string"
                    }
                }
            },
            "OnboardingRequest": {
                "type": "object",
                "properties": {
                    "addressType": {
                        "type": "string",
                        "enum": [
                            "XANIM",
                            "BEY"
                        ]
                    },
                    "therapyFormat": {
                        "type": "string",
                        "enum": [
                            "TEK",
                            "CUTLUK",
                            "AILE",
                            "DOSTLAR"
                        ]
                    },
                    "parentCount": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "childCount": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "femaleCount": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "maleCount": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "environments": {
                        "type": "array",
                        "items": {
                            "type": "string",
                            "enum": [
                                "SESSIZ",
                                "YARADICI",
                                "TEBIET",
                                "KITABXANA",
                                "MINIMALIST",
                                "SEMIMI"
                            ]
                        },
                        "maxItems": 3,
                        "minItems": 1
                    },
                    "concerns": {
                        "type": "array",
                        "items": {
                            "type": "string",
                            "enum": [
                                "AILE_PROBLEMLERI",
                                "SEVGI_PROBLEMLERI",
                                "TEKLIK",
                                "GELECEK_QAYGISI",
                                "AGIR_DEPRESSIYA",
                                "XRONIKI_YORGUNLUQ"
                            ]
                        },
                        "maxItems": 3,
                        "minItems": 1
                    }
                },
                "required": [
                    "addressType",
                    "concerns",
                    "environments",
                    "therapyFormat"
                ]
            },
            "OnboardingResponse": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "addressType": {
                        "type": "string",
                        "enum": [
                            "XANIM",
                            "BEY"
                        ]
                    },
                    "therapyFormat": {
                        "type": "string",
                        "enum": [
                            "TEK",
                            "CUTLUK",
                            "AILE",
                            "DOSTLAR"
                        ]
                    },
                    "parentCount": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "childCount": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "femaleCount": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "maleCount": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "environments": {
                        "type": "array",
                        "items": {
                            "type": "string",
                            "enum": [
                                "SESSIZ",
                                "YARADICI",
                                "TEBIET",
                                "KITABXANA",
                                "MINIMALIST",
                                "SEMIMI"
                            ]
                        }
                    },
                    "concerns": {
                        "type": "array",
                        "items": {
                            "type": "string",
                            "enum": [
                                "AILE_PROBLEMLERI",
                                "SEVGI_PROBLEMLERI",
                                "TEKLIK",
                                "GELECEK_QAYGISI",
                                "AGIR_DEPRESSIYA",
                                "XRONIKI_YORGUNLUQ"
                            ]
                        }
                    },
                    "completed": {
                        "type": "boolean"
                    }
                }
            },
            "JournalEntryRequest": {
                "type": "object",
                "properties": {
                    "mood": {
                        "type": "string",
                        "enum": [
                            "VERY_LOW",
                            "LOW",
                            "NEUTRAL",
                            "GOOD",
                            "VERY_GOOD"
                        ]
                    },
                    "thoughts": {
                        "type": "string",
                        "maxLength": 5000,
                        "minLength": 0
                    }
                },
                "required": [
                    "mood"
                ]
            },
            "JournalEntryResponse": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "entryDate": {
                        "type": "string",
                        "format": "date"
                    },
                    "mood": {
                        "type": "string"
                    },
                    "moodLabel": {
                        "type": "string"
                    },
                    "moodScore": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "thoughts": {
                        "type": "string"
                    },
                    "createdAt": {
                        "type": "string",
                        "format": "date-time"
                    },
                    "updatedAt": {
                        "type": "string",
                        "format": "date-time"
                    }
                }
            },
            "DoctorRegisterDto": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string"
                    },
                    "surname": {
                        "type": "string"
                    },
                    "fatherName": {
                        "type": "string"
                    },
                    "age": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "phone": {
                        "type": "string"
                    },
                    "cv": {
                        "type": "string",
                        "format": "binary"
                    }
                }
            },
            "WorkingHourRangeRequest": {
                "type": "object",
                "properties": {
                    "date": {
                        "type": "string",
                        "format": "date",
                        "example": "2026-11-20"
                    },
                    "startTime": {
                        "type": "string",
                        "example": "10:00"
                    },
                    "endTime": {
                        "type": "string",
                        "example": "11:00"
                    }
                }
            },
            "WorkingDayRequest": {
                "type": "object",
                "properties": {
                    "date": {
                        "type": "string",
                        "format": "date"
                    },
                    "times": {
                        "type": "array",
                        "items": {
                            "$ref": "#/components/schemas/LocalTime"
                        }
                    }
                }
            },
            "WorkingHoursBatchRequest": {
                "type": "object",
                "properties": {
                    "days": {
                        "type": "array",
                        "items": {
                            "$ref": "#/components/schemas/WorkingDayRequest"
                        }
                    }
                }
            },
            "AdminLoginRequest": {
                "type": "object",
                "properties": {
                    "username": {
                        "type": "string"
                    },
                    "password": {
                        "type": "string"
                    }
                }
            },
            "AuthResponse": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "token": {
                        "type": "string"
                    },
                    "refreshToken": {
                        "type": "string"
                    }
                }
            },
            "ResetPasswordWithOtpRequest": {
                "type": "object",
                "properties": {
                    "email": {
                        "type": "string"
                    },
                    "otp": {
                        "type": "string"
                    },
                    "newPassword": {
                        "type": "string",
                        "maxLength": 50,
                        "minLength": 8,
                        "pattern": "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).*$"
                    },
                    "confirmPassword": {
                        "type": "string"
                    }
                },
                "required": [
                    "confirmPassword",
                    "email",
                    "newPassword",
                    "otp"
                ]
            },
            "RefreshTokenRequest": {
                "type": "object",
                "properties": {
                    "refreshToken": {
                        "type": "string"
                    }
                }
            },
            "LoginRequest": {
                "type": "object",
                "properties": {
                    "email": {
                        "type": "string"
                    },
                    "password": {
                        "type": "string"
                    }
                },
                "required": [
                    "email",
                    "password"
                ]
            },
            "ForgotPasswordRequest": {
                "type": "object",
                "properties": {
                    "email": {
                        "type": "string"
                    }
                },
                "required": [
                    "email"
                ]
            },
            "DoctorLoginRequest": {
                "type": "object",
                "properties": {
                    "email": {
                        "type": "string"
                    },
                    "password": {
                        "type": "string"
                    }
                }
            },
            "CreateAppointmentRequest": {
                "type": "object",
                "properties": {
                    "doctorId": {
                        "type": "integer",
                        "format": "int64",
                        "description": "Həkimin ID-si",
                        "example": 1
                    },
                    "appointmentDate": {
                        "type": "string",
                        "format": "date",
                        "example": "2026-11-26"
                    },
                    "appointmentTime": {
                        "type": "string",
                        "format": "time",
                        "example": "10:00:00"
                    },
                    "mode": {
                        "type": "string",
                        "enum": [
                            "VR",
                            "VIDEO_CALL",
                            "APP"
                        ],
                        "example": "VIDEO_CALL"
                    },
                    "durationMinutes": {
                        "type": "integer",
                        "format": "int32",
                        "example": 45
                    },
                    "sessionsType": {
                        "type": "string",
                        "enum": [
                            "INDIVIDUAL",
                            "COUPLE"
                        ],
                        "example": "INDIVIDUAL"
                    }
                },
                "required": [
                    "appointmentDate",
                    "appointmentTime",
                    "doctorId",
                    "mode"
                ]
            },
            "AppointmentDto": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "patientId": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "patientName": {
                        "type": "string"
                    },
                    "doctorId": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "doctorName": {
                        "type": "string"
                    },
                    "doctorProfileImageUrl": {
                        "type": "string"
                    },
                    "appointmentDate": {
                        "type": "string",
                        "format": "date"
                    },
                    "appointmentTime": {
                        "$ref": "#/components/schemas/LocalTime"
                    },
                    "status": {
                        "type": "string",
                        "enum": [
                            "SCHEDULED",
                            "WAITING",
                            "IN_PROGRESS",
                            "COMPLETED",
                            "CANCELLED",
                            "PENDING_PAYMENT"
                        ]
                    },
                    "mode": {
                        "type": "string",
                        "enum": [
                            "VR",
                            "VIDEO_CALL",
                            "APP"
                        ]
                    },
                    "roomUrl": {
                        "type": "string"
                    },
                    "hasNote": {
                        "type": "boolean"
                    }
                }
            },
            "CreateSessionNoteRequest": {
                "type": "object",
                "properties": {
                    "subjective": {
                        "type": "string"
                    },
                    "objective": {
                        "type": "string"
                    },
                    "assessment": {
                        "type": "string"
                    },
                    "plan": {
                        "type": "string"
                    }
                },
                "required": [
                    "assessment",
                    "objective",
                    "plan",
                    "subjective"
                ]
            },
            "SessionNoteDto": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "subjective": {
                        "type": "string"
                    },
                    "objective": {
                        "type": "string"
                    },
                    "assessment": {
                        "type": "string"
                    },
                    "plan": {
                        "type": "string"
                    }
                }
            },
            "StartPaymentRequest": {
                "type": "object",
                "properties": {
                    "appointmentId": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "amount": {
                        "type": "number"
                    },
                    "description": {
                        "type": "string"
                    }
                }
            },
            "EmailNotificationRequest": {
                "type": "object",
                "properties": {
                    "to": {
                        "type": "string"
                    },
                    "template": {
                        "type": "string",
                        "enum": [
                            "SESSION_REMINDER_24H",
                            "SESSION_REMINDER_3H",
                            "SESSION_REMINDER_30MIN",
                            "OTP_CODE",
                            "SESSION_CONFIRMED",
                            "RESCHEDULE_CONFIRMED",
                            "RESCHEDULE_REQUEST",
                            "SPECIALIST_AVAILABILITY",
                            "PAYMENT_RECEIPT",
                            "SESSION_FEEDBACK",
                            "RECOMMENDED_MATERIALS",
                            "MILESTONE",
                            "HABIT_DAILY",
                            "MOOD_CHECK",
                            "BREATHING",
                            "JOURNAL",
                            "PSYCH_FACT",
                            "DAILY_RECOMMENDATION",
                            "PODCAST_AND_BOOK_OF_DAY",
                            "SCHEDULE_UPDATED",
                            "FAVORITE_AVAILABLE",
                            "WELCOME",
                            "GUIDE_NEKSI",
                            "FIRST_SESSION",
                            "INACTIVE_15_DAYS",
                            "INACTIVE_30_DAYS",
                            "INACTIVE_60_DAYS",
                            "NEW_SPECIALISTS"
                        ]
                    },
                    "params": {
                        "type": "object",
                        "additionalProperties": {
                            "type": "string"
                        }
                    }
                },
                "required": [
                    "template",
                    "to"
                ]
            },
            "EmailNotificationResponse": {
                "type": "object",
                "properties": {
                    "success": {
                        "type": "boolean"
                    },
                    "message": {
                        "type": "string"
                    },
                    "template": {
                        "type": "string",
                        "enum": [
                            "SESSION_REMINDER_24H",
                            "SESSION_REMINDER_3H",
                            "SESSION_REMINDER_30MIN",
                            "OTP_CODE",
                            "SESSION_CONFIRMED",
                            "RESCHEDULE_CONFIRMED",
                            "RESCHEDULE_REQUEST",
                            "SPECIALIST_AVAILABILITY",
                            "PAYMENT_RECEIPT",
                            "SESSION_FEEDBACK",
                            "RECOMMENDED_MATERIALS",
                            "MILESTONE",
                            "HABIT_DAILY",
                            "MOOD_CHECK",
                            "BREATHING",
                            "JOURNAL",
                            "PSYCH_FACT",
                            "DAILY_RECOMMENDATION",
                            "PODCAST_AND_BOOK_OF_DAY",
                            "SCHEDULE_UPDATED",
                            "FAVORITE_AVAILABLE",
                            "WELCOME",
                            "GUIDE_NEKSI",
                            "FIRST_SESSION",
                            "INACTIVE_15_DAYS",
                            "INACTIVE_30_DAYS",
                            "INACTIVE_60_DAYS",
                            "NEW_SPECIALISTS"
                        ]
                    },
                    "sentAt": {
                        "type": "string",
                        "format": "date-time"
                    }
                }
            },
            "ResetPasswordRequest": {
                "type": "object",
                "properties": {
                    "token": {
                        "type": "string"
                    },
                    "newPassword": {
                        "type": "string"
                    }
                }
            },
            "UpdateUserStatusRequest": {
                "type": "object",
                "properties": {
                    "status": {
                        "type": "string",
                        "enum": [
                            "SCHEDULED",
                            "WAITING",
                            "IN_PROGRESS",
                            "COMPLETED",
                            "CANCELLED",
                            "PENDING_PAYMENT"
                        ]
                    }
                },
                "required": [
                    "status"
                ]
            },
            "Pageable": {
                "type": "object",
                "properties": {
                    "page": {
                        "type": "integer",
                        "format": "int32",
                        "minimum": 0
                    },
                    "size": {
                        "type": "integer",
                        "format": "int32",
                        "minimum": 1
                    },
                    "sort": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    }
                }
            },
            "PageXeberResponseDto": {
                "type": "object",
                "properties": {
                    "totalElements": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "totalPages": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "pageable": {
                        "$ref": "#/components/schemas/PageableObject"
                    },
                    "size": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "content": {
                        "type": "array",
                        "items": {
                            "$ref": "#/components/schemas/XeberResponseDto"
                        }
                    },
                    "number": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "sort": {
                        "$ref": "#/components/schemas/SortObject"
                    },
                    "first": {
                        "type": "boolean"
                    },
                    "last": {
                        "type": "boolean"
                    },
                    "numberOfElements": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "empty": {
                        "type": "boolean"
                    }
                }
            },
            "PageableObject": {
                "type": "object",
                "properties": {
                    "paged": {
                        "type": "boolean"
                    },
                    "pageNumber": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "pageSize": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "offset": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "sort": {
                        "$ref": "#/components/schemas/SortObject"
                    },
                    "unpaged": {
                        "type": "boolean"
                    }
                }
            },
            "SortObject": {
                "type": "object",
                "properties": {
                    "sorted": {
                        "type": "boolean"
                    },
                    "empty": {
                        "type": "boolean"
                    },
                    "unsorted": {
                        "type": "boolean"
                    }
                }
            },
            "PageTrainingResponse": {
                "type": "object",
                "properties": {
                    "totalElements": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "totalPages": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "pageable": {
                        "$ref": "#/components/schemas/PageableObject"
                    },
                    "size": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "content": {
                        "type": "array",
                        "items": {
                            "$ref": "#/components/schemas/TrainingResponse"
                        }
                    },
                    "number": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "sort": {
                        "$ref": "#/components/schemas/SortObject"
                    },
                    "first": {
                        "type": "boolean"
                    },
                    "last": {
                        "type": "boolean"
                    },
                    "numberOfElements": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "empty": {
                        "type": "boolean"
                    }
                }
            },
            "TrainingTypeCountResponse": {
                "type": "object",
                "properties": {
                    "value": {
                        "type": "string"
                    },
                    "label": {
                        "type": "string"
                    },
                    "count": {
                        "type": "integer",
                        "format": "int64"
                    }
                }
            },
            "SiteSettingsResponseDto": {
                "type": "object",
                "properties": {
                    "customHeadScripts": {
                        "type": "string"
                    },
                    "customBodyScripts": {
                        "type": "string"
                    },
                    "robotsTxt": {
                        "type": "string"
                    },
                    "llmsTxt": {
                        "type": "string"
                    },
                    "updatedAt": {
                        "type": "string",
                        "format": "date-time"
                    }
                }
            },
            "DoctorSearchResult": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "fullName": {
                        "type": "string"
                    },
                    "bio": {
                        "type": "string"
                    }
                }
            },
            "ContentSearchResult": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string"
                    },
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "title": {
                        "type": "string"
                    }
                }
            },
            "PasientResponseDto": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "username": {
                        "type": "string"
                    },
                    "name": {
                        "type": "string"
                    },
                    "surname": {
                        "type": "string"
                    },
                    "email": {
                        "type": "string"
                    },
                    "age": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "phone": {
                        "type": "string"
                    },
                    "role": {
                        "type": "string",
                        "enum": [
                            "SUPER_ADMIN",
                            "BPM",
                            "DOCTOR",
                            "PATIENT",
                            "SEO"
                        ]
                    },
                    "verified": {
                        "type": "boolean"
                    }
                }
            },
            "DoctorPriceDto": {
                "type": "object",
                "properties": {
                    "label": {
                        "type": "string"
                    },
                    "minAge": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "maxAge": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "sessionType": {
                        "type": "string"
                    },
                    "durationMin": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "durationMax": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "amount": {
                        "type": "number"
                    },
                    "currency": {
                        "type": "string"
                    }
                }
            },
            "DoctorResponseDto": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "name": {
                        "type": "string"
                    },
                    "surname": {
                        "type": "string"
                    },
                    "username": {
                        "type": "string"
                    },
                    "profileImageUrl": {
                        "type": "string"
                    },
                    "bio": {
                        "$ref": "#/components/schemas/TitleDto"
                    },
                    "major": {
                        "$ref": "#/components/schemas/TitleDto"
                    },
                    "prices": {
                        "type": "array",
                        "items": {
                            "$ref": "#/components/schemas/DoctorPriceDto"
                        }
                    }
                }
            },
            "PageMeqaleResponseDto": {
                "type": "object",
                "properties": {
                    "totalElements": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "totalPages": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "pageable": {
                        "$ref": "#/components/schemas/PageableObject"
                    },
                    "size": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "content": {
                        "type": "array",
                        "items": {
                            "$ref": "#/components/schemas/MeqaleResponseDto"
                        }
                    },
                    "number": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "sort": {
                        "$ref": "#/components/schemas/SortObject"
                    },
                    "first": {
                        "type": "boolean"
                    },
                    "last": {
                        "type": "boolean"
                    },
                    "numberOfElements": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "empty": {
                        "type": "boolean"
                    }
                }
            },
            "PageJournalEntryResponse": {
                "type": "object",
                "properties": {
                    "totalElements": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "totalPages": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "pageable": {
                        "$ref": "#/components/schemas/PageableObject"
                    },
                    "size": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "content": {
                        "type": "array",
                        "items": {
                            "$ref": "#/components/schemas/JournalEntryResponse"
                        }
                    },
                    "number": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "sort": {
                        "$ref": "#/components/schemas/SortObject"
                    },
                    "first": {
                        "type": "boolean"
                    },
                    "last": {
                        "type": "boolean"
                    },
                    "numberOfElements": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "empty": {
                        "type": "boolean"
                    }
                }
            },
            "PageGalleryItemResponse": {
                "type": "object",
                "properties": {
                    "totalElements": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "totalPages": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "pageable": {
                        "$ref": "#/components/schemas/PageableObject"
                    },
                    "size": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "content": {
                        "type": "array",
                        "items": {
                            "$ref": "#/components/schemas/GalleryItemResponse"
                        }
                    },
                    "number": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "sort": {
                        "$ref": "#/components/schemas/SortObject"
                    },
                    "first": {
                        "type": "boolean"
                    },
                    "last": {
                        "type": "boolean"
                    },
                    "numberOfElements": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "empty": {
                        "type": "boolean"
                    }
                }
            },
            "DoctorDto": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "username": {
                        "type": "string"
                    },
                    "fullName": {
                        "type": "string"
                    },
                    "title": {
                        "$ref": "#/components/schemas/TitleDto"
                    },
                    "price": {
                        "type": "number",
                        "format": "double"
                    },
                    "experienceYear": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "rating": {
                        "type": "number",
                        "format": "double"
                    },
                    "bio": {
                        "$ref": "#/components/schemas/TitleDto"
                    },
                    "imageUrl": {
                        "type": "string"
                    },
                    "languages": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    },
                    "education": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    },
                    "certificates": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    },
                    "specializations": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    },
                    "trainings": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    }
                }
            },
            "AvailableSlotDto": {
                "type": "object",
                "properties": {
                    "date": {
                        "type": "string",
                        "format": "date"
                    },
                    "time": {
                        "$ref": "#/components/schemas/LocalTime"
                    },
                    "booked": {
                        "type": "boolean"
                    }
                }
            },
            "WorkingRangeDto": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "date": {
                        "type": "string",
                        "example": "20.11.2026"
                    },
                    "startTime": {
                        "type": "string",
                        "example": "10:00"
                    },
                    "endTime": {
                        "type": "string",
                        "example": "11:00"
                    }
                }
            },
            "ChatMessageResponseDto": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "appointmentId": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "senderRole": {
                        "type": "string",
                        "enum": [
                            "SUPER_ADMIN",
                            "BPM",
                            "DOCTOR",
                            "PATIENT",
                            "SEO"
                        ]
                    },
                    "senderId": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "content": {
                        "type": "string"
                    },
                    "sentAt": {
                        "type": "string",
                        "format": "date-time"
                    }
                }
            },
            "AppointmentEntity": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "pasient": {
                        "$ref": "#/components/schemas/PasientRegisterEntity"
                    },
                    "doctor": {
                        "$ref": "#/components/schemas/DoctorEntity"
                    },
                    "appointmentDate": {
                        "type": "string",
                        "format": "date"
                    },
                    "appointmentTime": {
                        "$ref": "#/components/schemas/LocalTime"
                    },
                    "finishTime": {
                        "type": "string",
                        "format": "date-time"
                    },
                    "durationMinutes": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "sessionsType": {
                        "type": "string",
                        "enum": [
                            "INDIVIDUAL",
                            "COUPLE"
                        ]
                    },
                    "status": {
                        "type": "string",
                        "enum": [
                            "SCHEDULED",
                            "WAITING",
                            "IN_PROGRESS",
                            "COMPLETED",
                            "CANCELLED",
                            "PENDING_PAYMENT"
                        ]
                    },
                    "mode": {
                        "type": "string",
                        "enum": [
                            "VR",
                            "VIDEO_CALL",
                            "APP"
                        ]
                    },
                    "roomUrl": {
                        "type": "string"
                    },
                    "createdAt": {
                        "type": "string",
                        "format": "date-time"
                    },
                    "note": {
                        "$ref": "#/components/schemas/SessionNote"
                    }
                }
            },
            "DoctorEntity": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "username": {
                        "type": "string"
                    },
                    "name": {
                        "type": "string"
                    },
                    "surname": {
                        "type": "string"
                    },
                    "university": {
                        "type": "string"
                    },
                    "major": {
                        "$ref": "#/components/schemas/TitleDto"
                    },
                    "imageURl": {
                        "type": "string"
                    },
                    "bio": {
                        "$ref": "#/components/schemas/TitleDto"
                    },
                    "experienceYear": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "profileImageUrl": {
                        "type": "string"
                    },
                    "email": {
                        "type": "string"
                    },
                    "password": {
                        "type": "string"
                    },
                    "role": {
                        "type": "string",
                        "enum": [
                            "SUPER_ADMIN",
                            "BPM",
                            "DOCTOR",
                            "PATIENT",
                            "SEO"
                        ]
                    },
                    "languages": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    },
                    "education": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    },
                    "specializations": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    },
                    "trainings": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    },
                    "prices": {
                        "type": "array",
                        "items": {
                            "$ref": "#/components/schemas/DoctorPriceEntity"
                        }
                    }
                }
            },
            "DoctorPriceEntity": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "doctor": {
                        "$ref": "#/components/schemas/DoctorEntity"
                    },
                    "label": {
                        "type": "string"
                    },
                    "minAge": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "maxAge": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "sessionType": {
                        "type": "string"
                    },
                    "durationMin": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "durationMax": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "amount": {
                        "type": "number"
                    },
                    "currency": {
                        "type": "string"
                    }
                }
            },
            "PasientRegisterEntity": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "name": {
                        "type": "string"
                    },
                    "surname": {
                        "type": "string"
                    },
                    "email": {
                        "type": "string"
                    },
                    "age": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "password": {
                        "type": "string"
                    },
                    "phone": {
                        "type": "string"
                    },
                    "deletedAt": {
                        "type": "string",
                        "format": "date-time"
                    },
                    "mood": {
                        "type": "string",
                        "enum": [
                            "SAD",
                            "HAPPY",
                            "TIRED",
                            "CALM",
                            "NORMAL"
                        ]
                    },
                    "moodUpdatedDate": {
                        "type": "string",
                        "format": "date"
                    },
                    "profileImageUrl": {
                        "type": "string"
                    },
                    "registrationImageUrl": {
                        "type": "string"
                    },
                    "status": {
                        "type": "string",
                        "enum": [
                            "TELEBE",
                            "ISCI",
                            "DIGER"
                        ]
                    },
                    "language": {
                        "type": "string",
                        "enum": [
                            "AZ",
                            "EN",
                            "RU"
                        ]
                    },
                    "twoFactorEnabled": {
                        "type": "boolean"
                    },
                    "appointments": {
                        "type": "array",
                        "items": {
                            "$ref": "#/components/schemas/AppointmentEntity"
                        }
                    },
                    "verified": {
                        "type": "boolean"
                    }
                },
                "required": [
                    "age"
                ]
            },
            "SessionNote": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "appointment": {
                        "$ref": "#/components/schemas/AppointmentEntity"
                    },
                    "subjective": {
                        "type": "string"
                    },
                    "objective": {
                        "type": "string"
                    },
                    "assessment": {
                        "type": "string"
                    },
                    "plan": {
                        "type": "string"
                    },
                    "createdAt": {
                        "type": "string",
                        "format": "date-time"
                    }
                }
            },
            "PageBlogResponse": {
                "type": "object",
                "properties": {
                    "totalElements": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "totalPages": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "pageable": {
                        "$ref": "#/components/schemas/PageableObject"
                    },
                    "size": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "content": {
                        "type": "array",
                        "items": {
                            "$ref": "#/components/schemas/BlogResponse"
                        }
                    },
                    "number": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "sort": {
                        "$ref": "#/components/schemas/SortObject"
                    },
                    "first": {
                        "type": "boolean"
                    },
                    "last": {
                        "type": "boolean"
                    },
                    "numberOfElements": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "empty": {
                        "type": "boolean"
                    }
                }
            },
            "AppointmentStatsDto": {
                "type": "object",
                "properties": {
                    "todayCount": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "weekCount": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "monthCount": {
                        "type": "integer",
                        "format": "int64"
                    }
                }
            }
        },
        "securitySchemes": {
            "bearerAuth": {
                "type": "http",
                "scheme": "bearer",
                "bearerFormat": "JWT"
            }
        }
    }
}