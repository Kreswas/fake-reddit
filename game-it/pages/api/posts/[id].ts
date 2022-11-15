import { NextApiRequest, NextApiResponse } from 'next';
import {
  deletePostById,
  getPostByIdAndValidSessionToken,
  updatePostById,
} from '../../../database/post';
import { getValidSessionByToken } from '../../../database/sessions';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const session =
    request.cookies.sessionToken &&
    (await getValidSessionByToken(request.cookies.sessionToken));

  if (!session) {
    response
      .status(400)
      .json({ errors: [{ message: 'No valid session token passed' }] });
    return;
  }

  const postId = Number(request.query.id);
  if (!postId) {
    return response.status(404).json({ message: 'Not a valid id' });
  }

  if (request.method === 'GET') {
    const post = await getPostByIdAndValidSessionToken(
      postId,
      request.cookies.sessionToken,
    );

    // check if the post exist
    if (!post) {
      return response
        .status(404)
        .json({ message: 'Not a valid Id or a valid session token' });
    }
    return response.status(200).json(post);
  }

  if (request.method === 'PUT') {
    // NOT getting the id from the body since is already on the query
    const title = request.body?.title;
    const body = request.body?.body;
    const postId = request.body?.postId;
    const image = request.body?.image;
    const subredditsId = request.body?.subredditsId;

    // Check all the information to create events
    if (!(title || body || postId)) {
      return response.status(400).json({ message: 'property is missing' });
    }

    // Create the post using the database util function

    const newPost = await updatePostById(
      postId,
      image,
      title,
      body,
      subredditsId,
    );

    if (!newPost) {
      return response.status(404).json({ message: 'Not a valid Id' });
    }

    // response with the new created event
    return response.status(200).json(newPost);
  }

  if (request.method === 'DELETE') {
    const deletedPost = await deletePostById(postId);

    if (!deletedPost) {
      return response.status(404).json({ message: 'Not a valid Id' });
    }

    return response.status(200).json(deletedPost);
  }

  return response.status(400).json({ message: 'Method Not Allowed' });
}
