declare global {
    namespace NodeJS {
        interface ProcessEnv {
            USER?: string;
            PASSWORD?: string;
            TARGET?: string;
        }
    }
}

export {}