//
//  ContentView.swift
//  Mutable (iOS)
//
//  Created by Idrees Hassan on 8/14/23.
//

import SwiftUI

struct ContentView: View {
    var body: some View {
        ZStack {
            Image("foil")
                .resizable()
                // This is a stupid way to ensure that the top and bottom bars are covered
                .padding(-80)
                .aspectRatio(contentMode: .fill)
            VStack {
//                Image("LargeIcon")
                Text("Welcome to Mutable!")
                Text("Hello, Sexy!")
                    .onTapGesture {
                        SFSafariApplication.showPreferencesForExtension(withIdentifier: extensionBundleIdentifier) { error in
                            guard error == nil else {
                                // Insert code to inform the user that something went wrong.
                                return
                            }
                        }
                    }
            }
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
