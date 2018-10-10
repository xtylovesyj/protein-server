class CacheData {
    static setCurrentRunProtein(protein) {
        CacheData.currentRunProtein = protein;
    }
    static getCurrentRunProtein() {
        return CacheData.currentRunProtein;
    }
}
module.exports = CacheData;