
export enum GetUserInfoResponseResult {
    success = "SUCCESS",
    userNotFound = "USER_NOT_FOUND",
    listEmpty = "EMPTY_LIST",
}

export enum GetUserInfoForSignedResponseResult {
    success = "SUCCESS",
    userNotFound = "USER_NOT_FOUND",
    listEmpty = "EMPTY_LIST",
}

export enum LoginUserResponseResult {
    success = "SUCCESS",
    userNotFound = "USER_NOT_FOUND",
    repetedEmail = "EMAIL_ALREADY_EXIST"
}

export enum UpdateBodyResponseResult {
    success = "SUCCESS",
    userNotFound = "USER_NOT_FOUND",
    userIsBody = "USER_SAME_AS_BODY",

}

export enum GetMovieInfoResponseResult {
    success = "SUCCESS",
    movieNotFound = "USER_NOT_FOUND",
    listEmpty = "EMPTY_LIST",
}

export enum GetMovieInfoForSignedResponseResult {
    success = "SUCCESS",
    movieNotFound = "USER_NOT_FOUND",
    listEmpty = "EMPTY_LIST",
}

export enum UpdateMovieRateResponseResult {
    success = "SUCCESS",
    movieuserNotFound = "MOVIEUSER_NOT_FOUND"
}

export enum SearchMovieResponseResult {
    success = "SUCCESS",
    listEmpty = "EMPTY_LIST",
    failed = "FAIL"
}