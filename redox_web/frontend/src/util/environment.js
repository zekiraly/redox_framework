export const models = {
    '3dgcn': {
        name: '3DGCN',
        availableFeaturizations: ['3dgcn-default'],
        params: {
            'epoch': {label: 'Epoch', type: 'number', default: 5},
            'batch': {label: 'Batch', type: 'number', default: 8},
            'fold': {label: 'Fold', type: 'number', default: 10},
            'units_conv': {label: 'Units_conv', type: 'number', default: 128},
            'units_dense': {label: 'Units_dense', type: 'number', default: 128},
            'pooling': {label: 'Pooling', type: 'text', default: 'sum'},
            'num_layers': {label: 'Number of layers', type: 'number', default: 2},
            'loss': {label: 'Loss function', type: 'text', default: 'mse'},
            'monitor': {label: 'Monitor', type: 'text', default: 'val_rmse'},
            'label': {label: 'Label', type: 'text', default: ''}
        }
    },
    'svr': {
        name: 'SVR',
        availableFeaturizations: ['svr-default'],
    }
}

export const featurizations = {
    '3dgcn-default': {
        name: 'Default (3DGCN)',
        params: {
            'use_atom_symbol': {label: 'use_atom_symbol', type: 'boolean', default: true},
            'use_degree': {label: 'use_degree', type: 'boolean', default: true},
            'use_hybridization': {label: 'use_hybridization', type: 'boolean', default: true},
            'use_implicit_valence': {label: 'use_implicit_valence', type: 'boolean', default: true},
            'use_partial_charge': {label: 'use_partial_charge', type: 'boolean', default: true},
            'use_ring_size': {label: 'use_ring_size', type: 'boolean', default: true},
            'use_hydrogen_bonding': {label: 'use_hydrogen_bonding', type: 'boolean', default: true},
            'use_acid_base': {label: 'use_acid_base', type: 'boolean', default: true},
            'use_aromaticity': {label: 'use_aromaticity', type: 'boolean', default: true},
            'use_chirality': {label: 'use_chirality', type: 'boolean', default: true},
            'use_num_hydrogen': {label: 'use_num_hydrogen', type: 'boolean', default: true}
        }
    },
    'svr-default': {
        name: 'Default (MACCS)',
    }
}