export const required_token_fields = {
  'header': 'Create Crypto Token',
  'id': 'required_token_fields',
  'items': [
    { 'name': 'Name',
      'ngModel_key': 'name',
      'description': 'Token/Project Name',
      'is_bsctoken_socials': false,
      'is_required': true,
      'field_type': 'text'
    },
    { 'name': 'Blockchain',
      'ngModel_key': 'blockchain',
      'description': 'Token Blockchain',
      'is_bsctoken_socials': false,
      'is_required': true,
      'field_type': 'select',
      'select_options': [
        { 'name': 'Bitcoin Blockchain', 'value': 'BTC' },
        { 'name': 'Cardano Blockchain', 'value': 'ADA' },
        { 'name': 'Ethereum Blockchain', 'value': 'ETH' },
        { 'name': 'Bitcoin Cash Blockchain', 'value': 'BCH' },
        { 'name': 'Binance Chain Blockchain', 'value': 'BNB-BEP2' },
        { 'name': 'Binance Smart Chain Blockchain', 'value': 'BNB-BEP20' },
        { 'name': 'Unknown Blockchain', 'value': 'UNKNOWN' },
      ],
    },
    { 'name': 'Status',
      'ngModel_key': 'status',
      'description': 'Token Status',
      'is_bsctoken_socials': false,
      'is_required': true,
      'field_type': 'select',
      'select_options': [
        { 'name': 'Public', 'value': 'PUBLIC' },
        { 'name': 'Private', 'value': 'PRIVATE' },
        { 'name': 'Archive', 'value': 'ARCHIVE' },
      ],
    },
  ]
};
export const token_info_fields = {
  'header': 'Crypto Token Information',
  'id': 'token_info_fields',
  'items': [
    { 'name': 'Symbol',
      'ngModel_key': 'symbol',
      'description': 'Token Symbol',
      'is_bsctoken_socials': false,
      'is_required': false,
      'field_type': 'text'
    },
    { 'name': 'Contract Address',
      'ngModel_key': 'contract_address',
      'description': 'Token Contract Address',
      'is_bsctoken_socials': false,
      'is_required': false,
      'field_type': 'text'
    },
    { "name": "Launch Date",
      "ngModel_key": "launch_date",
      "description": "Project Launch Date",
      'is_bsctoken_socials': false,
      'is_required': false,
      'field_type': 'datetime-local'
    },
    { "name": "Website",
      "ngModel_key": "website",
      "description": "Project Website URL link",
      'is_bsctoken_socials': false,
      'is_required': false,
      'field_type': 'url'
    },
    { "name": "Description",
      "ngModel_key": "description",
      "description": "Projects purpose or future details",
      'is_bsctoken_socials': false,
      'is_required': false,
      'field_type': 'text'
    },
    { "name": "Whitepaper",
      "ngModel_key": "whitepaper",
      "description": "Project Whitepaper URL link",
      'is_bsctoken_socials': false,
      'is_required': false,
      'field_type': 'url'
    },
    { "name": "Tags",
      "ngModel_key": "tags",
      "description": "Assign tags to tokens for filtering or organizing purposes.",
      'is_bsctoken_socials': false,
      'is_required': false,
      'field_type': 'text'
    },
  ]
};
export const token_social_fields = {
  'header': 'Crypto Socials',
  'id': 'token_social_fields',
  'items': [
    { 'name': 'Email',
      'ngModel_key': 'email',
      'description': 'Project Email Address',
      'is_bsctoken_socials': true,
      'is_required': false,
      'field_type': 'email'
    },
    { 'name': 'Blog',
      'ngModel_key': 'blog',
      'description': 'Project Blog URL link',
      'is_bsctoken_socials': true,
      'is_required': false,
      'field_type': 'url'
    },
    { 'name': 'Reddit',
      'ngModel_key': 'reddit',
      'description': 'Project Reddit URL link',
      'is_bsctoken_socials': true,
      'is_required': false,
      'field_type': 'url'
    },
    { 'name': 'Facebook',
      'ngModel_key': 'facebook',
      'description': 'Project Facebook URL link',
      'is_bsctoken_socials': true,
      'is_required': false,
      'field_type': 'url'
    },
    { 'name': 'Twitter',
      'ngModel_key': 'twitter',
      'description': 'Project Twitter URL link',
      'is_bsctoken_socials': true,
      'is_required': false,
      'field_type': 'url'
    },
    { 'name': 'Github',
      'ngModel_key': 'github',
      'description': 'Project Github URL link',
      'is_bsctoken_socials': true,
      'is_required': false,
      'field_type': 'url'
    },
    { 'name': 'Telegram',
      'ngModel_key': 'telegram',
      'description': 'Project Telegram URL link',
      'is_bsctoken_socials': true,
      'is_required': false,
      'field_type': 'url'
    },
    { 'name': 'LinkedIn',
      'ngModel_key': 'linkedin',
      'description': 'Project LinkedIn URL link',
      'is_bsctoken_socials': true,
      'is_required': false,
      'field_type': 'url'
    },
    { 'name': 'Discord',
      'ngModel_key': 'discord',
      'description': 'Project Discord URL link',
      'is_bsctoken_socials': true,
      'is_required': false,
      'field_type': 'url'
    },
    { 'name': 'Instagram',
      'ngModel_key': 'instagram',
      'description': 'Project Instagram URL link',
      'is_bsctoken_socials': true,
      'is_required': false,
      'field_type': 'url'
    },
    { 'name': 'YouTube',
      'ngModel_key': 'youtube',
      'description': 'Project YouTube Channel URL link',
      'is_bsctoken_socials': true,
      'is_required': false,
      'field_type': 'url'
    },
  ]
}
export const all_token_fields = {
  'header': 'Create Crypto Token',
  'id': 'required_token_fields',
  'items': [
    ...required_token_fields.items,
    ...token_info_fields.items,
    ...token_social_fields.items,
    ]
}
