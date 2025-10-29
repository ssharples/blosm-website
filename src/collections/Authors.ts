import type { CollectionConfig } from 'payload'

export const Authors: CollectionConfig = {
  slug: 'authors',
  admin: {
    useAsTitle: 'name',
    description: 'Article authors and contributors',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'bio',
      type: 'textarea',
      admin: {
        description: 'Short bio (200 characters)',
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Author profile photo',
      },
    },
    {
      name: 'role',
      type: 'text',
      admin: {
        description: 'Job title or role (e.g., "Founder & CEO")',
      },
    },
    {
      name: 'social',
      type: 'group',
      fields: [
        {
          name: 'twitter',
          type: 'text',
        },
        {
          name: 'linkedin',
          type: 'text',
        },
        {
          name: 'github',
          type: 'text',
        },
      ],
    },
  ],
}
