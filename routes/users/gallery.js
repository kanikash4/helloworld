'use strict';

var gallery = {

	getImages: function getImages(req, res, next) {
	},

	postImage: function postImage(req, res, next) {},

	deleteImage: function postImage(req, res, next) {}
};

module.exports = gallery;

//Users should be able to upload/download/view photos.
//The system should be able to generate and display a user’s timeline consisting of top photos from all the people the user follows.
//Practically users can upload as many photos as they like. Efficient management of storage should be a crucial factor while designing this system



// Not in scope AsOfNow
//Adding tags to photos, searching photos on tags, commenting on photos, tagging users to photos, who to follow, suggestions, etc.
//We can store photos in a distributed file storage like HDFS or S3

//We also need to store relationships between users and photos, to know who owns which photo. Another relationship we would need to store is the list of people a user follows. For both of these tables, we can use a wide-column datastore like Cassandra.
