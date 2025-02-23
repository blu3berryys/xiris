# xiris

Xiris is an update server for electron based applications. It's a SvelteKit replica of the [vercel/hazel](https://github.com/vercel/hazel) project.

- Uses SQLite caching (can be changed to memory easily for serverless applications)
- Supports private repositories
- i18n Support

## Configuration

You can configure the server by creating a `.env` file in the root of the project. The following environment variables are available:
- `APP_URL`: The url of your server. Going to be used for generating RELEASES files. (Required)
- `PORT`: The port the server will listen on. Defaults to `3000`.
- `GITHUB_REPO`: The GitHub repository to use for the update server. (Required)
- `GITHUB_TOKEN`: If you're using a private repository, you need to provide a GitHub token.
- `GITHUB_PRE_RELEASES`: If you want to allow pre-releases to be downloaded, set this to `true`.
- `GITHUB_PRE_UPDATE`: If you want to allow pre-releases in the update channel, set this to `true`.
- `REFRESH_INTERVAL`: The interval to refresh the update server. Defaults to `15m`.
