'use server';

import { cookies } from 'next/headers';

const COOKIE_NAME = 'aws-provider-type';

export async function getProviderType(): Promise<'aws' | 'localstack'> {
    const cookieStore = cookies();
    const type = cookieStore.get(COOKIE_NAME)?.value;
    return (type === 'localstack' || type === 'aws') ? type : 'aws';
}

export async function setProviderType(type: 'aws' | 'localstack') {
    const cookieStore = cookies();
    cookieStore.set(COOKIE_NAME, type, { sameSite: 'strict', path: '/' });
}
