// app/api/save-image/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const image = formData.get('image') as File;

  if (!image) {
    return NextResponse.json({ error: 'No image uploaded' }, { status: 400 });
  }

  const buffer = await image.arrayBuffer();
  const filename = `${Date.now()}_${image.name}`;
  const filepath = path.join(process.cwd(), 'public', 'uploads', filename);

  try {
    await writeFile(filepath, Buffer.from(buffer));
    return NextResponse.json({ success: true, filename });
  } catch (error) {
    console.error('Error saving image:', error);
    return NextResponse.json({ error: 'Failed to save image' }, { status: 500 });
  }
}