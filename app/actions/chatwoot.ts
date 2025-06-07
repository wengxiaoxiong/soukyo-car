"use server";

export async function getChatwootToken() {
    const token = process.env.CHATWOOT_TOKEN;
    return token;
}