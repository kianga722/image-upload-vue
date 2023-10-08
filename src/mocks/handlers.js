// server-handlers.js
// this is put into here so I can share these same handlers between my tests
// as well as my development in the browser. Pretty sweet!
import { rest } from 'msw' // msw supports graphql too!
import { galleryXML } from './responses/galleryXML';

const VITE_BUCKET_URL_THUMBNAILS = import.meta.env.VITE_BUCKET_URL_THUMBNAILS

const VITE_UPLOAD_ENDPOINT = import.meta.env.VITE_UPLOAD_ENDPOINT

let reqUrl = VITE_BUCKET_URL_THUMBNAILS;
let uploadUrl = VITE_UPLOAD_ENDPOINT;

const handlers = [
    rest.get(reqUrl, async (req, res, ctx) => {
        if (req.url.searchParams.get('continuation-token') !== null) {
            return res(
                ctx.xml(galleryXML[1])
            );
        }

        return res(
            ctx.xml(galleryXML[0])
        );
    }),
    rest.post(uploadUrl, (req, res, ctx) => {
        return res(
            ctx.json(
                {
                "url":"https://presignedUrl.amazonaws.com","fields": {
                    "bucket":"upload-bucket","X-Amz-Signature":"test"}
                }
            )
        );
    }),
    rest.post("https://presignedUrl.amazonaws.com", (req, res, ctx) => {
        return res(
            ctx.status(202, 'Mocked status')
        )
    })
]

export { handlers }
