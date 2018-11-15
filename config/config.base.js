const env = {
    // protein_base_path: '/Users/yaojun/robocode',
    protein_base_path: '/root/casp/temp_show',
    users: [{
        name: 'yao',
        pass: 'yaojun'
    }, {
        name: 'xie',
        pass: 'xietengyu'
    }],
    statistics: {
        scatter: 'accept_rmsd_energy.csv',
        line: 'average_rmsd_energy.csv'
    },
    servers: [
        '101.132.73.133',
        '35.201.142.215'
    ],
    status: 'status_info.txt',
    logs: 'log',
    pdbs: [
        'combo1_pul.pdb',
        'combo2_pul.pdb',
        'combo3_pul.pdb',
        'combo4_pul.pdb',
        'combo5_pul.pdb'
    ],
    emails: ['965072376@qq.com'],
    websocket_port: 9090,
    port: 80,
};

module.exports = env;