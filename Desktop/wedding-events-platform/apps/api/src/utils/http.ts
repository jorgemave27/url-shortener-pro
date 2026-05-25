import { APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

export function json(statusCode: number, body: unknown): APIGatewayProxyStructuredResultV2 {
  return {
    statusCode,
    headers: {
      'content-type': 'application/json',
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'access-control-allow-headers': 'content-type,authorization'
    },
    body: JSON.stringify(body)
  };
}

export function parseBody<T>(body?: string | null): T {
  if (!body) return {} as T;
  return JSON.parse(body) as T;
}
