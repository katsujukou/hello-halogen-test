module Hello.Component.App where


import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP
import Halogen.Hooks as Hooks

app :: forall q i o m
     . H.Component q i o m
app = Hooks.component \_ _ -> Hooks.do
  Hooks.pure do
    HH.div [HP.id "app"]
      [ HH.text "Hello world"
      ]