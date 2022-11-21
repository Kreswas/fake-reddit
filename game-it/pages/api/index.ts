// // Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import type { NextApiRequest, NextApiResponse } from 'next';

// type Data = {
//   name: string;
// };

// export default function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<Data>,
// ) {
//   res.status(200).json({ name: 'John Doe' });
// }

import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  // This is the response for any method on this endpoint
  response.status(200).json({ posts: 'http://localhost:3000/api/posts' });
}
