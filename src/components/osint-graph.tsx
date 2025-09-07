"use client";

import React from 'react';
import dynamic from 'next/dynamic';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d').then(module => module.default), {
  ssr: false,
});

const osintData = {
  nodes: [
    { id: 'OSINT Framework', name: 'OSINT Framework', val: 20 },
    { id: 'Username' },
    { id: 'Email Address' },
    { id: 'Domain Name' },
    { id: 'IP & MAC Address' },
    { id: 'Images / Videos / Docs' },
    { id: 'Social Networks' },
    { id: 'Instant Messaging' },
    { id: 'People Search Engines' },
    { id: 'Dating' },
    { id: 'Telephone Numbers' },
    { id: 'Public Records' },
    { id: 'Business Records' },
    { id: 'Transportation' },
    { id: 'Geolocation Tools / Maps' },
    { id: 'Search Engines' },
    { id: 'Forums / Blogs / IRC' },
    { id: 'Archives' },
    { id: 'Language Translation' },
    { id: 'Metadata' },
    { id: 'Mobile Emulation' },
    { id: 'Terrorism' },
    { id: 'Dark Web' },
    { id: 'Digital Currency' },
    { id: 'Classifieds' },
    { id: 'Encoding / Decoding' },
    { id: 'Tools' },
    { id: 'AI Tools' },
    { id: 'Malicious File Analysis' },
    { id: 'Exploits & Advisories' },
    { id: 'Skype', val: 5 },
    { id: 'Snapchat', val: 5 },
    { id: 'Kik', val: 5 },
    { id: 'Yikyak', val: 5 },
  ].map(node => ({ ...node, name: node.id, val: node.val || 10 })),
  links: [
    { source: 'OSINT Framework', target: 'Username' },
    { source: 'OSINT Framework', target: 'Email Address' },
    { source: 'OSINT Framework', target: 'Domain Name' },
    { source: 'OSINT Framework', target: 'IP & MAC Address' },
    { source: 'OSINT Framework', target: 'Images / Videos / Docs' },
    { source: 'OSINT Framework', target: 'Social Networks' },
    { source: 'OSINT Framework', target: 'Instant Messaging' },
    { source: 'OSINT Framework', target: 'People Search Engines' },
    { source: 'OSINT Framework', target: 'Dating' },
    { source: 'OSINT Framework', target: 'Telephone Numbers' },
    { source: 'OSINT Framework', target: 'Public Records' },
    { source: 'OSINT Framework', target: 'Business Records' },
    { source: 'OSINT Framework', target: 'Transportation' },
    { source: 'OSINT Framework', target: 'Geolocation Tools / Maps' },
    { source: 'OSINT Framework', target: 'Search Engines' },
    { source: 'OSINT Framework', target: 'Forums / Blogs / IRC' },
    { source: 'OSINT Framework', target: 'Archives' },
    { source: 'OSINT Framework', target: 'Language Translation' },
    { source: 'OSINT Framework', target: 'Metadata' },
    { source: 'OSINT Framework', target: 'Mobile Emulation' },
    { source: 'OSINT Framework', target: 'Terrorism' },
    { source: 'OSINT Framework', target: 'Dark Web' },
    { source: 'OSINT Framework', target: 'Digital Currency' },
    { source: 'OSINT Framework', target: 'Classifieds' },
    { source: 'OSINT Framework', target: 'Encoding / Decoding' },
    { source: 'OSINT Framework', target: 'Tools' },
    { source: 'OSINT Framework', target: 'AI Tools' },
    { source: 'OSINT Framework', target: 'Malicious File Analysis' },
    { source: 'OSINT Framework', target: 'Exploits & Advisories' },
    { source: 'Instant Messaging', target: 'Skype' },
    { source: 'Instant Messaging', target: 'Snapchat' },
    { source: 'Instant Messaging', target: 'Kik' },
    { source: 'Instant Messaging', target: 'Yikyak' },
  ],
};

export const OsintGraph = () => {
    return (
        <ForceGraph2D
            graphData={osintData}
            nodeLabel="name"
            nodeCanvasObject={(node, ctx, globalScale) => {
                const label = node.name as string;
                const fontSize = (node.val as number || 10) / globalScale * 1.5;
                ctx.font = `${fontSize}px Sans-Serif`;
                const textWidth = ctx.measureText(label).width;
                const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding

                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                if (node.x !== undefined && node.y !== undefined) {
                    ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, bckgDimensions[0], bckgDimensions[1]);
                }
                
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = 'blue';
                if (node.x !== undefined && node.y !== undefined) {
                    ctx.fillText(label, node.x, node.y);
                }
            }}
            nodePointerAreaPaint={(node, color, ctx) => {
                const label = node.name as string;
                const fontSize = (node.val as number || 10) / 1 * 1.5;
                ctx.font = `${fontSize}px Sans-Serif`;
                const textWidth = ctx.measureText(label).width;
                const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding
                
                ctx.fillStyle = color;
                if (node.x !== undefined && node.y !== undefined) {
                    ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, bckgDimensions[0], bckgDimensions[1]);
                }
              }}
            linkColor={() => 'rgba(0,0,0,0.2)'}
            linkWidth={1}
            height={600}
        />
    );
};
