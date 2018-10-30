const env = {
    protein_base_path: '/Users/yaojun/robocode',
    users: [{
        name: 'yaojun',
        pass: '1'
    }, {
        name: 'xie',
        pass: 'xietengyu'
    }],
    statistics: {
        scatter: 'accept_rmsd_energy.csv',
        line: 'average_rmsd_energy.csv'
    },
    emails: ['965072376@qq.com'],
    websocket_port: 9090,
    port: 3000,
};

module.exports = env;