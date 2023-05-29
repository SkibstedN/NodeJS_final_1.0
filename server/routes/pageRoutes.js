import express from 'express';
import path from 'path';

const router = express.Router();

const isAuthorized = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.redirect('/index.html');
  }
};

router.get('/checkSession', (req, res) => {
    if (req.session.userId) {
      res.json({ loggedIn: true });
    } else {
      res.json({ loggedIn: false });
    }
  });

  router.get('/frontpage', isAuthorized, (req, res) => {
    res.set('Cache-Control', 'no-store, must-revalidate, private').set('Expires', '-1').set('Pragma', 'no-cache');
    res.sendFile(path.resolve('../pages/frontpage.html'));
  });
  



export default router;