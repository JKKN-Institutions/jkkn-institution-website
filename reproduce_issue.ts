
import { z } from 'zod';

const schema = z.object({
    portfolio_url: z.string().optional().nullable().transform(val => val === '' ? null : val).pipe(z.union([z.string().url(), z.null()])),
    linkedin_url: z.string().optional().nullable().transform(val => val === '' ? null : val).pipe(z.union([z.string().url(), z.null()])),
});

const testCases = [
    { name: 'Both null', data: { portfolio_url: null, linkedin_url: null } },
    { name: 'Both empty string', data: { portfolio_url: '', linkedin_url: '' } }, // This case won't happen with || null logic but good to test
    { name: 'Valid URLs', data: { portfolio_url: 'https://example.com', linkedin_url: 'https://linkedin.com' } },
    { name: 'Invalid URL', data: { portfolio_url: 'invalid', linkedin_url: null } },
];

testCases.forEach(({ name, data }) => {
    const result = schema.safeParse(data);
    console.log(`Test Case: ${name}`);
    console.log(`Success: ${result.success}`);
    if (!result.success) {
        console.log(`Errors: ${JSON.stringify(result.error.flatten().fieldErrors)}`);
    }
    console.log('---');
});
