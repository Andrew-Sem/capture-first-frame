// app/api/upload-video/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const video = formData.get('video') as File;

  if (!video) {
    return NextResponse.json({ error: 'No video uploaded' }, { status: 400 });
  }

  const buffer = await video.arrayBuffer();
  const filename = `${Date.now()}_${video.name}`;
  const filepath = path.join(process.cwd(), 'public', 'uploads', filename);

  try {
    await writeFile(filepath, Buffer.from(buffer));
    return NextResponse.json({ success: true, filename });
  } catch (error) {
    console.error('Error saving video:', error);
    return NextResponse.json({ error: 'Failed to save video' }, { status: 500 });
  }
}