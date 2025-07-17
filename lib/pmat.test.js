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
const pmat_1 = require("./pmat");
const exec = __importStar(require("@actions/exec"));
jest.mock('@actions/exec');
describe('runPmat', () => {
    it('should parse the output of the pmat cli', async () => {
        const expectedOutput = {
            summary: {
                violations: [
                    {
                        file: 'src/main.ts',
                        severity: 'error',
                        value: 10
                    }
                ]
            }
        };
        exec.exec.mockImplementation((command, args, options) => {
            options.listeners.stdout(Buffer.from(JSON.stringify(expectedOutput)));
            return Promise.resolve(0);
        });
        const output = await (0, pmat_1.runPmat)('10', 'true');
        expect(output).toEqual(expectedOutput);
    });
    it('should handle no violations', async () => {
        const expectedOutput = {
            summary: {
                violations: []
            }
        };
        exec.exec.mockImplementation((command, args, options) => {
            options.listeners.stdout(Buffer.from(JSON.stringify(expectedOutput)));
            return Promise.resolve(0);
        });
        const output = await (0, pmat_1.runPmat)('10', 'true');
        expect(output).toEqual(expectedOutput);
    });
    it('should not fail on violation when failOnViolation is false', async () => {
        const expectedOutput = {
            summary: {
                violations: [
                    {
                        file: 'src/main.ts',
                        severity: 'error',
                        value: 11
                    }
                ]
            }
        };
        exec.exec.mockImplementation((command, args, options) => {
            expect(command).toContain('--fail-on-violation false');
            options.listeners.stdout(Buffer.from(JSON.stringify(expectedOutput)));
            return Promise.resolve(0);
        });
        const output = await (0, pmat_1.runPmat)('10', 'false');
        expect(output).toEqual(expectedOutput);
    });
});
