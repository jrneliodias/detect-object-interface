import { uploadFile, uploadFileService } from "../src/services/apiService";
import { describe, it, vi } from "vitest";

describe("Test of Upload File", () => {
  it("should return the video_name", async () => {
    const videoFile: File = new File([""], "video.mp4", { type: "video/mp4" });

    const spy = vi.spyOn();
  });
});
