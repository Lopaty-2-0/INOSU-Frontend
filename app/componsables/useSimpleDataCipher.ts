const useSimpleDataCipher = () => {
    const simpleHash = (str: string): string => {
        let hash: number = 0;

        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i);
            hash |= 0;
        }

        return Math.abs(hash).toString(36);
    }

    const encodeData = (data: Record<string, any>): string => {
        try {
            const json: string = JSON.stringify(data);
            const base64: string = btoa(json);
            const reversed: string = base64.split("").reverse().join("");
            const hash: string = simpleHash(base64);

            return `${hash}|${reversed}`;
        } catch {
            return "";
        }
    }

    const decodeData = (encoded: string | null): Record<string, any> | null => {
        if (!encoded || !encoded.includes("|")) return null;

        try {
            const [hash, reversed]: string[] | undefined = encoded.split("|");

            if (!hash || !reversed) return null;

            const base64: string = reversed.split("").reverse().join("");

            if (hash !== simpleHash(base64)) return null;

            const json: string = atob(base64);

            return JSON.parse(json);
        } catch {
            return null;
        }
    }

    return {
        encodeData,
        decodeData,
    };
}

export default useSimpleDataCipher;