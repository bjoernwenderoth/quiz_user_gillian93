// Generates the invitation QR code with macOS CoreImage (no external tools) and verifies it by decoding.
// Usage: swift scripts/qr.swift "<url>" public/invite/qr.png
import AppKit
import CoreImage
import CoreImage.CIFilterBuiltins

let args = CommandLine.arguments
let message = args[1], out = URL(fileURLWithPath: args[2])
let size: CGFloat = 600, quietZone: CGFloat = 2  // quiet zone in modules

let qr = CIFilter.qrCodeGenerator()
qr.message = Data(message.utf8)
qr.correctionLevel = "M"
guard let raw = qr.outputImage else { fatalError("QR generation failed") }

// Dark olive modules on ivory, matching the PROJECT X palette; dark-on-light scans most reliably.
let colored = raw.applyingFilter("CIFalseColor", parameters: [
  "inputColor0": CIColor(red: 0x17 / 255, green: 0x19 / 255, blue: 0x16 / 255),
  "inputColor1": CIColor(red: 0xf3 / 255, green: 0xf0 / 255, blue: 0xe8 / 255),
])
let modules = raw.extent.width + quietZone * 2
let scale = floor(size / modules)
let padded = colored.transformed(by: CGAffineTransform(translationX: quietZone, y: quietZone))
  .composited(over: CIImage(color: CIColor(red: 0xf3 / 255, green: 0xf0 / 255, blue: 0xe8 / 255)).cropped(to: CGRect(x: 0, y: 0, width: modules, height: modules)))
  .samplingNearest()
  .transformed(by: CGAffineTransform(scaleX: scale, y: scale))

let context = CIContext()
guard let cg = context.createCGImage(padded, from: padded.extent) else { fatalError("render failed") }
let rep = NSBitmapImageRep(cgImage: cg)
try rep.representation(using: .png, properties: [:])!.write(to: out)

// Verify: decode the written file again.
let check = CIImage(contentsOf: out)!
let detector = CIDetector(ofType: CIDetectorTypeQRCode, context: nil, options: [CIDetectorAccuracy: CIDetectorAccuracyHigh])!
let decoded = (detector.features(in: check).first as? CIQRCodeFeature)?.messageString
print("size \(cg.width)x\(cg.height) px, decoded: \(decoded ?? "NOTHING")", decoded == message ? "✓ matches" : "✗ MISMATCH")
