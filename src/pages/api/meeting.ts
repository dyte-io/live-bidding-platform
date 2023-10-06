import { NextApiRequest, NextApiResponse } from 'next';

const API_KEY = process.env.DYTE_API_KEY;
const ORG_ID = process.env.DYTE_ORG_ID;
const MEETING_ID = process.env.DYTE_MEETING_ID;

const BASIC_TOKEN = Buffer.from(ORG_ID + ':' + API_KEY).toString('base64');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({ success: false, message: 'Method Not Allowed' });
  }

  const { preset } = req.body;

  const participantResponse = await fetch(
    `https://api.cluster.dyte.in/v2/meetings/${MEETING_ID}/participants`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + BASIC_TOKEN,
      },
     
      body: JSON.stringify({
        name: preset === 'group_call_host' ? 'Host' : 'Participant',
        preset_name: preset,
        custom_participant_id: new Date().toString(),
      }),
    }
  );

  res.status(participantResponse.status).json(await participantResponse.json());
}
