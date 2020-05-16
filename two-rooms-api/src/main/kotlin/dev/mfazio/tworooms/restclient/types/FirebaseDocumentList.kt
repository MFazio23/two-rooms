package dev.mfazio.tworooms.restclient.types

data class FirebaseDocumentList(
    val documents: List<FirebaseDocument>,
    val nextPageToken: String
)