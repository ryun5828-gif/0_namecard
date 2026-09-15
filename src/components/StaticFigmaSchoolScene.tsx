import Image from "next/image";
import type { CSSProperties } from "react";

export type OdysseyEra = "middle" | "high";

type OdysseyLayer = {
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotate?: number;
  flipX?: boolean;
  fit?: "cover" | "contain";
  zIndex?: number;
  motion?: "spin" | "sway" | "cloud" | "bird" | "cola" | "curtain" | "lamp";
  motionDuration?: string;
  motionDelay?: string;
};

const middleSchoolLayers: OdysseyLayer[] = [
  { src: "imgImage332.png", x: 699, y: 147, width: 377, height: 377 },
  { src: "imgImage327.png", x: 244, y: 68, width: 1696, height: 1272 },
  { src: "imgImage324.png", x: 597, y: 844, width: 184, height: 245, motion: "sway", motionDuration: "7.6s", motionDelay: "-2.1s" },
  { src: "imgImage319.png", x: 244, y: 178, width: 225, height: 225, motion: "cloud", motionDuration: "11.8s", motionDelay: "-3.2s" },
  { src: "img13.png", x: 1349, y: 35, width: 341, height: 256, motion: "cloud", motionDuration: "14.2s", motionDelay: "-9.6s" },
  { src: "imgImage302.png", x: -116, y: 163, width: 481, height: 722, motion: "sway", motionDuration: "8.7s", motionDelay: "-5.2s" },
  { src: "imgImage316.png", x: 93, y: 885, width: 1011, height: 337 },
  { src: "imgImage306.png", x: -286, y: 704, width: 677, height: 577, rotate: -15.94, fit: "contain", motion: "cola", motionDuration: "7.8s", motionDelay: "-5.1s" },
  { src: "imgImage322.png", x: 868, y: 559, width: 436, height: 545 },
  { src: "imgImage326.png", x: 660, y: 680, width: 300, height: 400, motion: "sway", motionDuration: "6.8s", motionDelay: "-1.4s" },
  { src: "imgImage317.png", x: 788, y: 828, width: 261, height: 261, motion: "cola", motionDuration: "7.2s", motionDelay: "-2.3s" },
  { src: "imgImage329.png", x: 469, y: 92, width: 312, height: 234, motion: "bird", motionDuration: "5.8s", motionDelay: "-1.1s" },
  { src: "imgImage330.png", x: 843, y: 41, width: 361, height: 451, rotate: 15 },
  { src: "imgImage325.png", x: 1428, y: 95, width: 739, height: 985, zIndex: 120, motion: "sway", motionDuration: "9.2s", motionDelay: "-4.7s" },
  { src: "imgImage323.png", x: 1025, y: 855, width: 206, height: 275, motion: "sway", motionDuration: "7.9s", motionDelay: "-6.3s" },
  { src: "img.png", x: 1810, y: 35, width: 147, height: 197, zIndex: 122, motion: "bird", motionDuration: "6.6s", motionDelay: "-3.7s" },
  { src: "imgImage338.png", x: 1212, y: 525, width: 558, height: 557, zIndex: 124, motion: "spin", motionDuration: "8.5s", motionDelay: "-2s" },
  { src: "imgImage339.png", x: 1104, y: 457, width: 774, height: 774, zIndex: 125 },
];

const highSchoolLayers: OdysseyLayer[] = [
  { src: "imgImage335.png", x: 77, y: 47, width: 941, height: 1175 },
  { src: "imgImage334.png", x: -36, y: 0, width: 748, height: 935, motion: "curtain", motionDuration: "6.8s", motionDelay: "-2.4s" },
  { src: "imgImage333.png", x: -53, y: 622, width: 502, height: 502 },
  { src: "imgImage336.png", x: 371, y: 704, width: 564, height: 423 },
  { src: "imgImage337.png", x: 548, y: -68, width: 238, height: 238, motion: "lamp", motionDuration: "7.5s", motionDelay: "-1.6s" },
  { src: "imgImage340.png", x: 786, y: 858, width: 244, height: 244, motion: "sway", motionDuration: "8.2s", motionDelay: "-2.5s" },
  { src: "imgImage345.png", x: 1618, y: 398, width: 289, height: 289, motion: "spin", motionDuration: "52s", motionDelay: "-21s" },
  { src: "imgImage341.png", x: 827, y: 122, width: 219, height: 219, flipX: true },
  { src: "imgImage348.png", x: 1938, y: 633, width: 991, height: 454, rotate: 3.72 },
  { src: "imgImage341.png", x: 922, y: 255, width: 124, height: 124, flipX: true },
  { src: "imgImage350.png", x: 1030, y: 473, width: 1648, height: 1236, motion: "sway", motionDuration: "10.4s", motionDelay: "-7s" },
  { src: "imgImage349.png", x: 1479, y: 134, width: 796, height: 994, flipX: true },
  { src: "imgImage342.png", x: 2043, y: 264, width: 576, height: 863 },
  { src: "imgImage347.png", x: 2318, y: 713, width: 420, height: 525, motion: "sway", motionDuration: "8.8s", motionDelay: "-4s" },
  { src: "imgImage356.png", x: 900, y: 267, width: 651, height: 813, motion: "sway", motionDuration: "9.6s", motionDelay: "-5.5s" },
  { src: "imgImage351.png", x: 1179, y: 289, width: 429, height: 286 },
  { src: "imgImage346.png", x: 765, y: 473, width: 530, height: 662, motion: "sway", motionDuration: "7.4s", motionDelay: "-1.8s" },
  { src: "imgImage352.png", x: 2231, y: -85, width: 511, height: 767, rotate: -15, fit: "contain", motion: "sway", motionDuration: "9s", motionDelay: "-6.8s" },
  { src: "imgImage353.png", x: 2002, y: 264, width: 202, height: 168 },
  { src: "img12.png", x: 1103, y: -68, width: 449, height: 337, motion: "cloud", motionDuration: "12.8s", motionDelay: "-8.1s" },
  { src: "imgImage354.png", x: 1705, y: 133, width: 173, height: 173 },
  { src: "imgImage355.png", x: 1179, y: 848, width: 300, height: 150, rotate: -15, fit: "contain" },
  { src: "imgImage358.png", x: 752, y: 362, width: 158, height: 155, rotate: 15, motion: "spin", motionDuration: "22s", motionDelay: "-4s" },
];

export default function FigmaOdysseyPanoramaLayers() {
  const frameWidth = 6368;
  const layerNodes = (layers: OdysseyLayer[], offsetX: number, zStart: number) => layers.map((layer, index) => <div
    key={`${offsetX}-${layer.src}-${index}`}
    className={`figma-panorama-layer${layer.motion ? ` figma-motion-${layer.motion}` : ""}`}
    style={{
      left: `${(offsetX + layer.x) / frameWidth * 100}%`,
      top: `${layer.y / 1080 * 100}%`,
      width: `${layer.width / frameWidth * 100}%`,
      height: `${layer.height / 1080 * 100}%`,
      zIndex: layer.zIndex ?? zStart + index,
      transform: `${layer.flipX ? "scaleX(-1) " : ""}${layer.rotate ? `rotate(${layer.rotate}deg)` : ""}`.trim() || undefined,
      "--motion-duration": layer.motionDuration,
      "--motion-delay": layer.motionDelay,
    } as CSSProperties}
  ><Image src={`/images/figma-odyssey/${layer.src}`} alt="" fill sizes="35vw" style={{ objectFit: layer.fit ?? "cover" }} loading="eager" /></div>);

  return <>
    <div className="figma-panorama-background figma-panorama-middle-bg">
      <div className="figma-scene-background" />
      <Image src="/images/figma-odyssey/imgImage305.png" alt="" fill sizes="100vw" className="figma-scene-texture" loading="eager" />
    </div>
    <div className="figma-panorama-background figma-panorama-high-bg">
      <div className="figma-scene-background" />
      <Image src="/images/figma-odyssey/imgImage344.png" alt="" fill sizes="135vw" className="figma-scene-texture" loading="eager" />
    </div>
    {layerNodes(middleSchoolLayers, 1867, 30)}
    {layerNodes(highSchoolLayers, 3787, 70)}
  </>;
}




