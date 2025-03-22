import { NextRequest, NextResponse } from 'next/server';
import { pinata } from '@/lib/pinata';

export async function GET(request: NextRequest) {
    try {
        // Get the CID parameter from the URL
        const url = new URL(request.url);
        const cid = url.searchParams.get('cid');

        // Check if CID is provided
        if (!cid) {
            return NextResponse.json(
                { success: false, error: 'CID parameter is required' },
                { status: 400 }
            );
        }

        // Generate the signed URL
        const signedUrl = await pinata.gateways.createSignedURL({
            cid: cid,
            expires: 1800, // 30 minutes
        });

        return NextResponse.json({ success: true, url: signedUrl });
    } catch (error) {
        console.error('Error generating signed URL:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to generate signed URL' },
            { status: 500 }
        );
    }
}
