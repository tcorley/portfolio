import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";

/**
 * Render the RenderCV resume into public/resume.pdf during production builds.
 * Runs for both `npm run build` and Wrangler/Vite builds used by Workers Builds
 * previews, so /resume.pdf is present outside the GitHub Actions deploy path.
 */
export function resumePdfPlugin(): Plugin {
	let rendered = false;

	return {
		name: "resume-pdf",
		apply: "build",
		buildStart() {
			if (rendered || process.env.RESUME_PDF_SKIP === "1") {
				return;
			}
			rendered = true;

			const root = process.cwd();
			execSync("make -C resume render", { stdio: "inherit", cwd: root });

			const pdfSource = path.join(root, "resume/build/resume.pdf");
			const pdfDest = path.join(root, "public/resume.pdf");
			if (!fs.existsSync(pdfSource)) {
				throw new Error(
					`Resume render did not produce ${pdfSource}; cannot publish /resume.pdf`,
				);
			}
			fs.copyFileSync(pdfSource, pdfDest);
		},
	};
}
