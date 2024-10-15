import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const video = formData.get('video') as File;

  if (!video) {
    return NextResponse.json({ error: 'No video uploaded' }, { status: 400 });
  }

  const buffer = await video.arrayBuffer();
  const filename = `${Date.now()}_${video.name}`;
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  const filepath = path.join(uploadsDir, filename);

  try {
    // Создаем директорию, если она не существует
    await mkdir(uploadsDir, { recursive: true });
    await writeFile(filepath, Buffer.from(buffer));
    return NextResponse.json({ success: true, filename });
  } catch (error) {
    console.error('Error saving video:', error);
    return NextResponse.json({ error: 'Failed to save video' }, { status: 500 });
  }
}
