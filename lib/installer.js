"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.installPmat = installPmat;
const exec = __importStar(require("@actions/exec"));
const core = __importStar(require("@actions/core"));
async function installPmat() {
    try {
        // Get the effective URL of the latest release to find the version tag.
        // This avoids the GitHub API and its rate limits.
        const { stdout: effectiveUrl } = await exec.getExecOutput('curl', [
            '-Ls',
            '-o',
            '/dev/null',
            '-w',
            '%{url_effective}',
            'https://github.com/paiml/paiml-mcp-agent-toolkit/releases/latest'
        ]);
        // The version is the last part of the redirected URL
        const version = effectiveUrl.split('/').pop();
        if (!version) {
            throw new Error('Could not determine the latest version from GitHub releases.');
        }
        core.info(`Installing pmat ${version}`);
        // Pass version directly to install script
        await exec.exec('bash', ['-c', `curl -sSfL https://raw.githubusercontent.com/paiml/paiml-mcp-agent-toolkit/master/scripts/install.sh | sh -s ${version}`]);
    }
    catch (error) {
        if (error instanceof Error) {
            core.setFailed(`Installation failed: ${error.message}`);
        }
        else {
            core.setFailed(`Installation failed: ${String(error)}`);
        }
    }
}
