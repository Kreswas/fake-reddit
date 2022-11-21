import { NextApiRequest, NextApiResponse } from 'next';
import { createComment, getComments } from '../../../database/comments';
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
  if (request.method === 'GET') {
    const posts = await getComments();
    return response.status(200).json(posts);
  }

  if (request.method === 'POST') {
    const postId = Number(request.body?.postId);
    console.log('postid', postId);
    const text = request.body?.text;
    const userId = Number(request.body?.userId);

    if (!(postId || text || userId)) {
      return response
        .status(400)
        .json({ message: 'property of the comment is missing' });
    }
    // create a new post using the database util function
    const newComment = await createComment(text, postId, userId);
    console.log(newComment);
    return response.status(200).json(newComment);
  }

  return response.status(400).json({ message: 'Method not allowed' });
}
