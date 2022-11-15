import { NextApiRequest, NextApiResponse } from 'next';
import { createPost, getPost } from '../../../database/post';
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
    const posts = await getPost();
    return response.status(200).json(posts);
  }

  if (request.method === 'POST') {
    // const image = request.body?.image;
    const title = request.body?.title;
    const body = request.body?.body;
    const subredditsId = request.body?.subredditsId;
    const userId = Number(request.body?.userId);
    console.log('check', userId);
    if (!(title && body && subredditsId && userId)) {
      return response
        .status(400)
        .json({ message: 'one of the properties of the form is missing' });
    }
    // create a new post using the database util function
    // const newPost = await createPost(image, title, body, subredditsId, userId);
    const newPost = await createPost(title, body, subredditsId, userId);
    console.log('newpost', newPost);
    return response.status(200).json(newPost);
  }

  return response.status(400).json({ message: 'Method not allowed' });
}
