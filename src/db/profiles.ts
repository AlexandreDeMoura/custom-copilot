'use server'

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const encoder = new TextEncoder()
const decoder = new TextDecoder()

async function getKey(secret: string) {
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        encoder.encode(secret),
        { name: "PBKDF2" },
        false,
        ["deriveBits", "deriveKey"]
    )
    return crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: encoder.encode("salt"),
            iterations: 100000,
            hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    )
}

async function encrypt(text: string) {
    if (!text) {
        throw new Error('Text to encrypt cannot be empty')
    }

    if (!process.env.SECRET_KEY) {
        throw new Error('SECRET_KEY is not defined')
    }

    const key = await getKey(process.env.SECRET_KEY)
    const iv = crypto.getRandomValues(new Uint8Array(12))
    const encrypted = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        key,
        encoder.encode(text)
    )

    const encryptedArray = new Uint8Array(encrypted)
    const result = new Uint8Array(iv.length + encryptedArray.length)
    result.set(iv)
    result.set(encryptedArray, iv.length)

    return Buffer.from(result).toString('base64')
}

async function decrypt(encryptedText: string) {
    if (!process.env.SECRET_KEY) {
        throw new Error('SECRET_KEY is not defined')
    }

    const key = await getKey(process.env.SECRET_KEY)
    const encryptedData = Buffer.from(encryptedText, 'base64')
    const iv = encryptedData.slice(0, 12)
    const data = encryptedData.slice(12)

    const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: iv },
        key,
        data
    )

    return decoder.decode(decrypted)
}

export async function getProfile() {
    const { data, error } = await supabase
        .from('profile')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(1)
        .single()

    if (error) throw error

    // For Edge runtime, we'll use the encrypted value directly
    // Make sure your OpenAI key is properly stored in the database
    return {
        ...data,
        openai_key: data.openai_key,
        anthropic_key: data.anthropic_key
    }
}

export async function createProfile(openaiKey: string, anthropicKey: string) {
    const { data, error } = await supabase
        .from('profile')
        .insert({
            openai_key: await encrypt(openaiKey),
            anthropic_key: await encrypt(anthropicKey)
        })
        .select()
        .single()

    if (error) throw error
    return data
}

export async function updateProfile(updates: { openaiKey?: string, anthropicKey?: string }) {
    const encryptedUpdates: any = {}
    if (updates.openaiKey) encryptedUpdates.openai_key = await encrypt(updates.openaiKey)
    if (updates.anthropicKey) encryptedUpdates.anthropic_key = await encrypt(updates.anthropicKey)

    const { data, error } = await supabase
        .from('profile')
        .update({ ...encryptedUpdates, updated_at: new Date().toISOString() })
        .order('created_at', { ascending: true })
        .limit(1)
        .select()
        .single()

    if (error) throw error
    return data
}

export async function deleteProfile() {
    const { error } = await supabase
        .from('profile')
        .delete()
        .limit(1)

    if (error) throw error
}

export async function updateOpenAIKey(openaiKey: string) {
    'use server'

    const { data, error } = await supabase
        .from('profile')
        .update({
            openai_key: openaiKey, // Store the key directly
            updated_at: new Date().toISOString()
        })
        .order('created_at', { ascending: true })
        .limit(1)
        .select()
        .single()

    if (error) throw error
    return data
}

export async function updateAnthropicKey(anthropicKey: string) {
    const { data, error } = await supabase
        .from('profile')
        .update({ anthropic_key: await encrypt(anthropicKey), updated_at: new Date().toISOString() })
        .order('created_at', { ascending: true })
        .limit(1)
        .select()
        .single()

    if (error) throw error
    return data
}
