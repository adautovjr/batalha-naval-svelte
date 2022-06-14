/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }: any) {
  const response = await resolve(event, {
    ssr: false,
    transformPage: ({ html }: any) => html.replace('old', 'new')
  });

  return response;
}