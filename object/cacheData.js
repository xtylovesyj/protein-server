class CacheData {
    static setCurrentRunProtein(protein) {
        if (CacheData.currentRunProtein) {
            CacheData.currentRunProtein.push(protein);
        } else {
            CacheData.currentRunProtein = [protein];
        }
    }
    static getCurrentRunProtein() {
        return CacheData.currentRunProtein;
    }
    static clearProtein(protein) {
        let location = null;
        let hasSuccess = false;
        if (CacheData.currentRunProtein) {
            CacheData.currentRunProtein.forEach((value, index) => {
                if (value === protein) {
                    location = index;
                    return;
                }
            });
            if (location) {
                CacheData.currentRunProtein.splice(location, 1);
                hasSuccess = true;
            }
        }
        return hasSuccess;
    }

    static clearAll() {
        CacheData.currentRunProtein = null;
    }

}
module.exports = CacheData;