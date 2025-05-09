const useArrayChunks = <T>(array: T[], chunkLength: number): T[][] => {
    const result: T[][] = [];

    for (let i = 0; i < array.length; i += chunkLength) {
        result.push(array.slice(i, i + chunkLength));
    }

    return result;
}

export default useArrayChunks;