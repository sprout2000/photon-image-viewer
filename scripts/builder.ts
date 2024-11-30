import { build } from "electron-builder";
import dotenv from "dotenv";

dotenv.config();

build({
  config: {
    productName: "Photon Image Viewer",
    artifactName: "${productName}-${version}-${platform}-${arch}.${ext}",
    copyright: "© 2020 sprout2000 and other contributors.",
    directories: {
      output: "release",
      buildResources: "assets",
    },
    files: ["dist/**/*"],
    mac: {
      appId: "jp.wassabie64.Photon Image Viewer",
      category: "public.app-category.photography",
      target: [
        {
          target: "default",
          arch: ["x64", "arm64"],
        },
      ],
      icon: "assets/icon.icns",
      darkModeSupport: true,
      extendInfo: {
        CFBundleName: "Photon Image Viewer",
        CFBundleDisplayName: "Photon Image Viewer",
        CFBundleExecutable: "Photon Image Viewer",
        CFBundlePackageType: "APPL",
        CFBundleDocumentTypes: [
          {
            CFBundleTypeName: "ImageFile",
            CFBundleTypeRole: "Viewer",
            LSItemContentTypes: [
              "com.google.webp",
              "com.microsoft.bmp",
              "com.microsoft.ico",
              "com.compuserve.gif",
              "public.jpeg",
              "public.png",
            ],
            LSHandlerRank: "Default",
          },
        ],
        NSRequiresAquaSystemAppearance: false,
      },
      // identity: null,
      notarize: {
        teamId: "285FKU3L4F",
      },
    },
  },
});
