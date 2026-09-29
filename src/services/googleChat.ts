/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleChatSpace, GoogleChatMessage, ListSpacesResponse, ListMessagesResponse } from '../types/chat';

const GOOGLE_CHAT_API_BASE = 'https://chat.googleapis.com/v1';

/**
 * List spaces visible to the authenticated user.
 */
export async function listChatSpaces(accessToken: string): Promise<GoogleChatSpace[]> {
  const response = await fetch(`${GOOGLE_CHAT_API_BASE}/spaces`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorDetail = response.statusText;
    try {
      const parsed = JSON.parse(errorText);
      errorDetail = parsed.error?.message || errorDetail;
    } catch {
      // Keep errorDetail as statusText
    }
    throw new Error(`Google Chat API error (${response.status}): ${errorDetail}`);
  }

  const data: ListSpacesResponse = await response.json();
  return data.spaces || [];
}

/**
 * List recent messages in a given space.
 */
export async function listSpaceMessages(
  accessToken: string,
  spaceName: string,
  pageSize = 15
): Promise<GoogleChatMessage[]> {
  const encodedSpace = encodeURIComponent(spaceName).replace(/%2F/g, '/');
  const url = `${GOOGLE_CHAT_API_BASE}/${encodedSpace}/messages?pageSize=${pageSize}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorDetail = response.statusText;
    try {
      const parsed = JSON.parse(errorText);
      errorDetail = parsed.error?.message || errorDetail;
    } catch {
      // Keep errorDetail
    }
    throw new Error(`Failed to fetch messages (${response.status}): ${errorDetail}`);
  }

  const data: ListMessagesResponse = await response.json();
  return data.messages || [];
}

/**
 * Send a message to a Google Chat space.
 * Note: Caller MUST prompt the user with a confirmation modal before triggering this function.
 */
export async function sendChatMessage(
  accessToken: string,
  spaceName: string,
  text: string
): Promise<GoogleChatMessage> {
  const encodedSpace = encodeURIComponent(spaceName).replace(/%2F/g, '/');
  const url = `${GOOGLE_CHAT_API_BASE}/${encodedSpace}/messages`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorDetail = response.statusText;
    try {
      const parsed = JSON.parse(errorText);
      errorDetail = parsed.error?.message || errorDetail;
    } catch {
      // Keep errorDetail
    }
    throw new Error(`Failed to send message to Google Chat (${response.status}): ${errorDetail}`);
  }

  return response.json();
}
