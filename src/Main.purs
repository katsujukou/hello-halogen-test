module Main where

import Prelude

import Effect (Effect)
import Effect.Aff (launchAff_)
import Halogen.Aff (awaitBody)
import Halogen.VDom.Driver (runUI)
import Hello.Component.App (app)

main :: Effect Unit
main = launchAff_ do
  body <- awaitBody
  runUI app {} body
